data = {
    region: {
        name: "Africa",
        avgAge: 19.7,
        avgDailyIncomeInUSD: 5,
        avgDailyIncomePopulation: 0.71
    },
    periodType: "days",
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
};

const infectionsByRequestedTime = (elapsedTime, currentlyInfected) => {
    //check multiples of 3 in the elapsed time
    const numOfThreesInElapsedTime = Math.floor(elapsedTime / 3);
    //check the remainder after getting multiples of 3
    const extraDays = elapsedTime % 3;
    //compute both
    const part1CurrentlyInfected = currentlyInfected * (2 ** numOfThreesInElapsedTime);
    const part2CurrentlyInfected = (part1CurrentlyInfected / 72) * extraDays;
    return Math.round(part1CurrentlyInfected + part2CurrentlyInfected);
};

const covid19ImpactEstimator = (data) => {
    const impactReportedCases = data.reportedCases * 10,
    severeImpactReportedCases = data.reportedCases * 50,
    impactInfectionsByRequestedTime = infectionsByRequestedTime(data.timeToElapse, impactReportedCases),
    severeImpactInfectionsByRequestedTime = infectionsByRequestedTime(data.timeToElapse, severeImpactReportedCases),
    impactSevereCasesByRequestedTime = Math.round(0.15 * impactInfectionsByRequestedTime),
    severeImpactSevereCasesByRequestedTime = Math.round(0.15 * severeImpactInfectionsByRequestedTime),
    availableBeds = Math.round(0.35 * data.totalHospitalBeds),
    impactHospitalBedsByRequestedTime =  availableBeds - (Math.round(0.15 * impactInfectionsByRequestedTime)),
    severeImpactHospitalBedsByRequestedTime = availableBeds - (Math.round(0.15 * severeImpactInfectionsByRequestedTime)),
    impactCasesForICUByRequestedTime = Math.round(0.05 * impactInfectionsByRequestedTime),
    severImpactCasesForICUByRequestedTime = Math.round(0.05 * severeImpactInfectionsByRequestedTime),
    impactDollarsInFlight = impactInfectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.timeToElapse,
    severImpactDollarsInFlight = severeImpactInfectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.timeToElapse;
    return {
        data: data,
        impact: {
            currentlyInfected: impactReportedCases,
            infectionsByRequestedTime: impactInfectionsByRequestedTime,
            severeCasesByRequestedTime: impactSevereCasesByRequestedTime,
            hospitalBedsByRequestedTime: impactHospitalBedsByRequestedTime,
            casesForICUByRequestedTime: impactCasesForICUByRequestedTime,
            casesForVentilatorsByRequestedTime: Math.round(0.02 * impactInfectionsByRequestedTime),
            dollarsInFlight: impactDollarsInFlight
        },
        severeImpact: {
            currentlyInfected: severeImpactReportedCases,
            infectionsByRequestedTime: severeImpactInfectionsByRequestedTime,
            severeCasesByRequestedTime: severeImpactSevereCasesByRequestedTime,
            hospitalBedsByRequestedTime: severeImpactHospitalBedsByRequestedTime,
            casesForICUByRequestedTime: severImpactCasesForICUByRequestedTime,
            casesForVentilatorsByRequestedTime: Math.round(0.02 * severeImpactInfectionsByRequestedTime),
            dollarsInFlight: severImpactDollarsInFlight
        }
    };
};
