package com.datapulse.backend.service;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.datapulse.backend.repository.CrimeIncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class NetworkService {

    @Autowired
    private CrimeIncidentRepository crimeIncidentRepository;

    public Map<String, Object> getNetworkData() {
        List<CrimeIncident> allCrimes = crimeIncidentRepository.findAll();

        List<Map<String, Object>> nodes = new ArrayList<>();
        List<Map<String, Object>> edges = new ArrayList<>();
        Set<String> nodeIds = new HashSet<>();

        // Group crimes by reportedBy (officer name as criminal identifier)
        Map<String, List<CrimeIncident>> officerCrimes = allCrimes.stream()
                .filter(c -> c.getReportedBy() != null && !c.getReportedBy().isEmpty())
                .collect(Collectors.groupingBy(CrimeIncident::getReportedBy));

        // Create nodes from officers with crimes
        int nodeIndex = 0;
        for (Map.Entry<String, List<CrimeIncident>> entry : officerCrimes.entrySet()) {
            String name = entry.getKey();
            List<CrimeIncident> crimes = entry.getValue();

            String nodeId = "n" + (++nodeIndex);
            nodeIds.add(nodeId);

            // Calculate risk level based on crime count and severity
            String riskLevel = calculateRiskLevel(crimes);

            Map<String, Object> node = new HashMap<>();
            node.put("id", nodeId);
            node.put("name", name);
            node.put("type", "criminal");
            node.put("riskLevel", riskLevel);
            node.put("crimeCount", crimes.size());
            node.put("group", "A"); // Default group

            nodes.add(node);
        }

        // Create edges between officers who share district or category
        List<String> officerNames = new ArrayList<>(officerCrimes.keySet());
        for (int i = 0; i < officerNames.size(); i++) {
            for (int j = i + 1; j < officerNames.size(); j++) {
                String name1 = officerNames.get(i);
                String name2 = officerNames.get(j);

                List<CrimeIncident> crimes1 = officerCrimes.get(name1);
                List<CrimeIncident> crimes2 = officerCrimes.get(name2);

                // Check if they have connections (same district or category)
                boolean hasConnection = false;
                String relationship = "Connected";
                int strength = 1;

                // Check same district
                for (CrimeIncident c1 : crimes1) {
                    for (CrimeIncident c2 : crimes2) {
                        if (c1.getDistrict() != null && c2.getDistrict() != null &&
                                c1.getDistrict().equals(c2.getDistrict())) {
                            hasConnection = true;
                            relationship = "Same District";
                            strength = 5;
                            break;
                        }
                        if (c1.getCategory() != null && c2.getCategory() != null &&
                                c1.getCategory().equals(c2.getCategory())) {
                            hasConnection = true;
                            relationship = "Same Category";
                            strength = 3;
                            break;
                        }
                    }
                    if (hasConnection) break;
                }

                if (hasConnection) {
                    String sourceId = getNodeIdByName(name1, nodes);
                    String targetId = getNodeIdByName(name2, nodes);

                    if (sourceId != null && targetId != null) {
                        Map<String, Object> edge = new HashMap<>();
                        edge.put("source", sourceId);
                        edge.put("target", targetId);
                        edge.put("relationship", relationship);
                        edge.put("strength", strength);
                        edge.put("type", "direct");
                        edges.add(edge);
                    }
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("nodes", nodes);
        response.put("edges", edges);

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("totalNodes", nodes.size());
        metadata.put("totalEdges", edges.size());
        metadata.put("lastUpdated", new Date().toString());
        response.put("metadata", metadata);

        return response;
    }

    private String calculateRiskLevel(List<CrimeIncident> crimes) {
        int count = crimes.size();
        long criticalCount = crimes.stream()
                .filter(c -> c.getSeverity().name().equals("CRITICAL"))
                .count();

        if (count >= 5 || criticalCount >= 2) return "CRITICAL";
        if (count >= 3 || criticalCount >= 1) return "HIGH";
        if (count >= 2) return "MEDIUM";
        return "LOW";
    }

    private String getNodeIdByName(String name, List<Map<String, Object>> nodes) {
        for (Map<String, Object> node : nodes) {
            if (name.equals(node.get("name"))) {
                return (String) node.get("id");
            }
        }
        return null;
    }
}