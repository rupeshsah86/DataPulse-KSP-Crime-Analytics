package com.datapulse.backend.service;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.datapulse.backend.entity.com.datapulse.enums.Status;
import com.datapulse.backend.repository.CrimeIncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OfficerPerformanceService {

    @Autowired
    private CrimeIncidentRepository crimeIncidentRepository;

    public List<Map<String, Object>> getOfficerPerformance() {
        List<CrimeIncident> allCrimes = crimeIncidentRepository.findAll();

        // Group crimes by reportedBy (officer name)
        Map<String, List<CrimeIncident>> officerCrimes = allCrimes.stream()
                .filter(c -> c.getReportedBy() != null && !c.getReportedBy().isEmpty())
                .collect(Collectors.groupingBy(CrimeIncident::getReportedBy));

        List<Map<String, Object>> officerStats = new ArrayList<>();

        for (Map.Entry<String, List<CrimeIncident>> entry : officerCrimes.entrySet()) {
            String name = entry.getKey();
            List<CrimeIncident> crimes = entry.getValue();

            int totalCases = crimes.size();
            long resolvedCases = crimes.stream()
                    .filter(c -> c.getStatus() == Status.CLOSED)
                    .count();

            double resolutionRate = totalCases > 0 ? (double) resolvedCases / totalCases * 100 : 0;

            Map<String, Object> officer = new HashMap<>();
            officer.put("name", name);
            officer.put("totalCases", totalCases);
            officer.put("resolvedCases", resolvedCases);
            officer.put("resolutionRate", Math.round(resolutionRate * 10.0) / 10.0);
            officer.put("designation", "Officer"); // Default designation
            officer.put("activeCases", crimes.stream()
                    .filter(c -> c.getStatus() == Status.OPEN || c.getStatus() == Status.INVESTIGATING)
                    .count());

            officerStats.add(officer);
        }

        // Sort by resolution rate (highest first)
        officerStats.sort((a, b) ->
                Double.compare((double) b.get("resolutionRate"), (double) a.get("resolutionRate"))
        );

        // Add rank and trend
        for (int i = 0; i < officerStats.size(); i++) {
            Map<String, Object> officer = officerStats.get(i);
            officer.put("rank", i + 1);

            // Simple trend (random for demo - can be calculated from historical data)
            officer.put("trend", i % 2 == 0 ? "up" : "down");
            officer.put("change", Math.round((Math.random() * 6 + 0.5) * 10.0) / 10.0);
        }

        return officerStats;
    }
}