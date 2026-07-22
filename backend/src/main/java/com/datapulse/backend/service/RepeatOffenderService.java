package com.datapulse.backend.service;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.datapulse.backend.repository.CrimeIncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RepeatOffenderService {

    @Autowired
    private CrimeIncidentRepository crimeIncidentRepository;

    public Map<String, Object> getRepeatOffenders() {
        List<CrimeIncident> allCrimes = crimeIncidentRepository.findAll();

        // Group by reportedBy (officer name as offender identifier for demo)
        Map<String, List<CrimeIncident>> offenderMap = allCrimes.stream()
                .filter(c -> c.getReportedBy() != null && !c.getReportedBy().isEmpty())
                .collect(Collectors.groupingBy(CrimeIncident::getReportedBy));

        // Filter those with more than 1 crime
        Map<String, List<CrimeIncident>> repeatOffenders = offenderMap.entrySet().stream()
                .filter(entry -> entry.getValue().size() >= 2)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        List<Map<String, Object>> offenderList = new ArrayList<>();

        for (Map.Entry<String, List<CrimeIncident>> entry : repeatOffenders.entrySet()) {
            String name = entry.getKey();
            List<CrimeIncident> crimes = entry.getValue();

            // Sort by date (newest first)
            crimes.sort((a, b) -> b.getIncidentDate().compareTo(a.getIncidentDate()));

            // Calculate risk level based on crime count and severity
            String riskLevel = calculateRiskLevel(crimes);

            Map<String, Object> offender = new HashMap<>();
            offender.put("id", name.hashCode());
            offender.put("name", name);
            offender.put("crimeCount", crimes.size());
            offender.put("lastCrimeDate", crimes.get(0).getIncidentDate().toString());
            offender.put("firstCrimeDate", crimes.get(crimes.size() - 1).getIncidentDate().toString());
            offender.put("riskLevel", riskLevel);

            // Add crime details
            List<Map<String, Object>> crimeDetails = new ArrayList<>();
            for (CrimeIncident crime : crimes) {
                Map<String, Object> crimeDetail = new HashMap<>();
                crimeDetail.put("id", crime.getId());
                crimeDetail.put("title", crime.getTitle());
                crimeDetail.put("category", crime.getCategory());
                crimeDetail.put("severity", crime.getSeverity().name());
                crimeDetail.put("status", crime.getStatus().name());
                crimeDetail.put("incidentDate", crime.getIncidentDate().toString());
                crimeDetail.put("district", crime.getDistrict());
                crimeDetails.add(crimeDetail);
            }
            offender.put("crimes", crimeDetails);

            offenderList.add(offender);
        }

        // Sort by crime count (highest first)
        offenderList.sort((a, b) -> Integer.compare((int) b.get("crimeCount"), (int) a.get("crimeCount")));

        // Calculate stats
        long highRisk = offenderList.stream()
                .filter(o -> o.get("riskLevel").equals("CRITICAL") || o.get("riskLevel").equals("HIGH"))
                .count();
        long mediumRisk = offenderList.stream()
                .filter(o -> o.get("riskLevel").equals("MEDIUM"))
                .count();
        long lowRisk = offenderList.stream()
                .filter(o -> o.get("riskLevel").equals("LOW"))
                .count();

        Map<String, Object> response = new HashMap<>();
        response.put("totalOffenders", offenderList.size());
        response.put("highRiskCount", highRisk);
        response.put("mediumRiskCount", mediumRisk);
        response.put("lowRiskCount", lowRisk);
        response.put("topOffenders", offenderList);

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
}