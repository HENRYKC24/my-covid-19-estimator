const infectionsByRequestedTime = (elapsedTime, currentlyInfected) => {
    const numOfThreesInElapsedTime = Math.floor(elapsedTime / 3);
    const extraDays = elapsedTime % 3;
    const part1CurrentlyInfected = currentlyInfected * (2 ** numOfThreesInElapsedTime);
    const part2CurrentlyInfected = (part1CurrentlyInfected / 72) * extraDays;
    return Math.round(part1CurrentlyInfected + part2CurrentlyInfected);
};
const normaliseIndays = (periodType, timeToElapse) => {
    let result = timeToElapse;
    const options = ['days', 'weeks', 'months'];
    if (options.indexOf(periodType) === 1) {
        result = timeToElapse * 7;
    };
    let then;
    if (options.indexOf(periodType) === 2) {
        const now = new Date();
        const nowMonth = now.getMonth();
        const nowDate = now.getDate();
        const nowYear = now.getFullYear();
        const nowHour = now.getHours();
        const nowMinutes = now.getMinutes();
        const nowSeconds = now.getSeconds();
        const nowmilliseconds = now.getMilliseconds();
        const totalMonths = nowMonth + timeToElapse;
        const workingMonth = totalMonths + 1;
        const months30s = [4, 6, 9, 11];
        if (workingMonth > 12) {
            const addedYears = Math.floor(workingMonth / 12);
            const futureYear = nowYear + addedYears;
            const futureMonths = workingMonth % 12;
            if (futureYear % 4 !== 0 && futureMonths == 2 && nowDate > 28) {
                nowDate = 28;
            };
            if (months30s.indexOf(futureMonths) > -1 && nowDate == 31) {
                nowDate = 30;
            };
            then = new Date(futureYear, futureMonths, nowDate, nowHour, nowMinutes, nowSeconds, nowmilliseconds);
        } else {
            const futureYear = nowYear;
            futureMonths = nowMonth + timeToElapse;
            then = new Date(futureYear, futureMonths, nowDate, nowHour, nowMinutes, nowSeconds, nowmilliseconds);
        };
        const timeDifferenceInMilliseconds = then.getTime() - now.getTime();
        result = Math.ceil(timeDifferenceInMilliseconds / 86400000);
    };
    return result;
};

const covid19ImpactEstimator = (data) => {
    const impactReportedCases = data.reportedCases * 10;
    const severeImpactReportedCases = data.reportedCases * 50;
    const normalisedTimeToElapse = normaliseIndays(data.periodType, data.timeToElapse);
    const impactInfectionsByRequestedTime = infectionsByRequestedTime(normalisedTimeToElapse, impactReportedCases);
    const severeImpactInfectionsByRequestedTime = infectionsByRequestedTime(normalisedTimeToElapse, severeImpactReportedCases);
    const impactSevereCasesByRequestedTime = Math.round(0.15 * impactInfectionsByRequestedTime);
    const severeImpactSevereCasesByRequestedTime = Math.round(0.15 * severeImpactInfectionsByRequestedTime);
    const availableBeds = Math.round(0.35 * data.totalHospitalBeds);
    const impactHospitalBedsByRequestedTime =  availableBeds - (Math.round(0.15 * impactInfectionsByRequestedTime));
    const severeImpactHospitalBedsByRequestedTime = availableBeds - (Math.round(0.15 * severeImpactInfectionsByRequestedTime));
    const impactCasesForICUByRequestedTime = Math.round(0.05 * impactInfectionsByRequestedTime);
    const severImpactCasesForICUByRequestedTime = Math.round(0.05 * severeImpactInfectionsByRequestedTime);
    const impactDollarsInFlight = Math.floor(impactInfectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.timeToElapse);
    const severImpactDollarsInFlight = Math.floor(severeImpactInfectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.timeToElapse);
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
    }
};
export default covid19ImpactEstimator;