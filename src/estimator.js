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
    const impactReportedCases = data.reportedCases * 10;
    const severeImpactReportedCases = data.reportedCases * 50;
    const impactInfectionsByRequestedTime = infectionsByRequestedTime(data.timeToElapse, impactReportedCases);
    const severeImpactInfectionsByRequestedTime = infectionsByRequestedTime(data.timeToElapse, severeImpactReportedCases);
    const availableBeds = 0.35 * data.totalHospitalBeds;
    return {
        data: data,
        impact: {
            currentlyInfected: impactReportedCases,
            infectionsByRequestedTime: impactInfectionsByRequestedTime,
            severeCasesByRequestedTime: Math.round(0.15 * impactInfectionsByRequestedTime),
            hospitalBedsByRequestedTime: availableBeds - (Math.round(0.15 * impactInfectionsByRequestedTime))
        },
        severeImpact: {
            currentlyInfected: severeImpactReportedCases,
            infectionsByRequestedTime: severeImpactInfectionsByRequestedTime,
            severeCasesByRequestedTime: Math.round(0.15 * severeImpactInfectionsByRequestedTime),
            hospitalBedsByRequestedTime: availableBeds - (Math.round(0.15 * severeImpactInfectionsByRequestedTime))
        }
    };
};
