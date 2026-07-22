package com.datapulse.backend.service;

import com.datapulse.backend.entity.com.datapulse.Criminal;
import com.datapulse.backend.entity.com.datapulse.CriminalNetwork;
import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.datapulse.backend.repository.CriminalNetworkRepository;
import com.datapulse.backend.repository.CriminalRepository;
import com.datapulse.backend.repository.CrimeIncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CriminalService {

    @Autowired
    private CriminalRepository criminalRepository;

    @Autowired
    private CriminalNetworkRepository criminalNetworkRepository;

    @Autowired
    private CrimeIncidentRepository crimeIncidentRepository;

    // ============================================
    // CRUD OPERATIONS
    // ============================================

    public Criminal createCriminal(Criminal criminal) {
        // Generate criminal ID if not provided
        if (criminal.getCriminalId() == null || criminal.getCriminalId().isEmpty()) {
            criminal.setCriminalId(generateCriminalId());
        }
        return criminalRepository.save(criminal);
    }

    public List<Criminal> getAllCriminals() {
        return criminalRepository.findAll();
    }

    public Optional<Criminal> getCriminalById(Long id) {
        return criminalRepository.findById(id);
    }

    public void deleteCriminal(Long id) {
        criminalRepository.deleteById(id);
    }

    // ============================================
    // NETWORK OPERATIONS
    // ============================================

    public CriminalNetwork addConnection(Long criminal1Id, Long criminal2Id, String relationshipType) {
        Criminal criminal1 = criminalRepository.findById(criminal1Id)
                .orElseThrow(() -> new RuntimeException("Criminal 1 not found"));
        Criminal criminal2 = criminalRepository.findById(criminal2Id)
                .orElseThrow(() -> new RuntimeException("Criminal 2 not found"));

        CriminalNetwork network = CriminalNetwork.builder()
                .criminal1(criminal1)
                .criminal2(criminal2)
                .relationshipType(relationshipType)
                .strength(calculateStrength(relationshipType))
                .connectionDate(LocalDate.now())
                .isActive(true)
                .build();

        return criminalNetworkRepository.save(network);
    }

    public List<CriminalNetwork> getCriminalNetwork(Long criminalId) {
        return criminalNetworkRepository.findAllByCriminalId(criminalId);
    }

    public Map<String, Object> getNetworkData() {
        List<Criminal> criminals = criminalRepository.findAll();
        List<CriminalNetwork> networks = criminalNetworkRepository.findAll();

        List<Map<String, Object>> nodes = new ArrayList<>();
        List<Map<String, Object>> edges = new ArrayList<>();

        // Create nodes from criminals
        for (Criminal criminal : criminals) {
            Map<String, Object> node = new HashMap<>();
            node.put("id", "c" + criminal.getId());
            node.put("name", criminal.getFullName());
            node.put("riskLevel", getRiskLevel(criminal.getRiskScore()));
            node.put("crimeCount", criminal.getCrimeCount() != null ? criminal.getCrimeCount() : 0);
            node.put("type", "criminal");
            nodes.add(node);
        }

        // Create edges from networks
        for (CriminalNetwork network : networks) {
            Map<String, Object> edge = new HashMap<>();
            edge.put("source", "c" + network.getCriminal1().getId());
            edge.put("target", "c" + network.getCriminal2().getId());
            edge.put("relationship", network.getRelationshipType());
            edge.put("strength", network.getStrength() != null ? network.getStrength() : 5);
            edge.put("type", "direct");
            edges.add(edge);
        }

        // If no network data exists, generate from crime data
        if (networks.isEmpty()) {
            return generateNetworkFromCrimeData();
        }

        Map<String, Object> result = new HashMap<>();
        result.put("nodes", nodes);
        result.put("edges", edges);

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("totalNodes", nodes.size());
        metadata.put("totalEdges", edges.size());
        metadata.put("lastUpdated", new Date().toString());
        result.put("metadata", metadata);

        return result;
    }

    // ============================================
    // GENERATE NETWORK FROM CRIME DATA
    // ============================================

    private Map<String, Object> generateNetworkFromCrimeData() {
        List<CrimeIncident> crimes = crimeIncidentRepository.findAll();
        Map<String, List<CrimeIncident>> criminalMap = new HashMap<>();

        // Group crimes by reportedBy (officer name as criminal identifier)
        for (CrimeIncident crime : crimes) {
            if (crime.getReportedBy() != null && !crime.getReportedBy().isEmpty()) {
                String name = crime.getReportedBy();
                criminalMap.computeIfAbsent(name, k -> new ArrayList<>()).add(crime);
            }
        }

        List<Map<String, Object>> nodes = new ArrayList<>();
        List<Map<String, Object>> edges = new ArrayList<>();
        List<String> criminalNames = new ArrayList<>(criminalMap.keySet());

        // Create nodes
        int nodeId = 1;
        for (Map.Entry<String, List<CrimeIncident>> entry : criminalMap.entrySet()) {
            String name = entry.getKey();
            List<CrimeIncident> crimesList = entry.getValue();

            Map<String, Object> node = new HashMap<>();
            node.put("id", "c" + nodeId);
            node.put("name", name);
            node.put("riskLevel", calculateRiskLevel(crimesList));
            node.put("crimeCount", crimesList.size());
            node.put("type", "criminal");
            nodes.add(node);
            nodeId++;
        }

        // Create edges based on shared districts or categories
        for (int i = 0; i < criminalNames.size(); i++) {
            for (int j = i + 1; j < criminalNames.size(); j++) {
                String name1 = criminalNames.get(i);
                String name2 = criminalNames.get(j);

                List<CrimeIncident> crimes1 = criminalMap.get(name1);
                List<CrimeIncident> crimes2 = criminalMap.get(name2);

                // Check for connections
                boolean connected = false;
                String relationship = "Connected";
                int strength = 3;

                // Check same district
                for (CrimeIncident c1 : crimes1) {
                    for (CrimeIncident c2 : crimes2) {
                        if (c1.getDistrict() != null && c2.getDistrict() != null &&
                                c1.getDistrict().equals(c2.getDistrict())) {
                            connected = true;
                            relationship = "Same District";
                            strength = 7;
                            break;
                        }
                        if (c1.getCategory() != null && c2.getCategory() != null &&
                                c1.getCategory().equals(c2.getCategory())) {
                            connected = true;
                            relationship = "Same Category";
                            strength = 5;
                            break;
                        }
                    }
                    if (connected) break;
                }

                if (connected) {
                    Map<String, Object> edge = new HashMap<>();
                    edge.put("source", "c" + (i + 1));
                    edge.put("target", "c" + (j + 1));
                    edge.put("relationship", relationship);
                    edge.put("strength", strength);
                    edge.put("type", "direct");
                    edges.add(edge);
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("nodes", nodes);
        result.put("edges", edges);

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("totalNodes", nodes.size());
        metadata.put("totalEdges", edges.size());
        metadata.put("lastUpdated", new Date().toString());
        result.put("metadata", metadata);

        return result;
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private String generateCriminalId() {
        long count = criminalRepository.count() + 1;
        return "CRIM-" + String.format("%06d", count);
    }

    private int calculateStrength(String relationshipType) {
        switch (relationshipType) {
            case "PARTNER": return 10;
            case "FAMILY": return 9;
            case "GANG": return 8;
            case "ACCOMPLICE": return 7;
            case "SAME_CASE": return 6;
            case "ASSOCIATE": return 5;
            default: return 3;
        }
    }

    private String getRiskLevel(Double riskScore) {
        if (riskScore == null) return "LOW";
        if (riskScore >= 80) return "CRITICAL";
        if (riskScore >= 60) return "HIGH";
        if (riskScore >= 40) return "MEDIUM";
        return "LOW";
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
}