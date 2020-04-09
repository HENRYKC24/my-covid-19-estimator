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
/* a function that handles all vallues to determine how the infected 
** persons doubles overtime
*/
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

//a function that normalises weeks and months to days
const normaliseIndays = (periodType, timeToElapse) => {
    let result = timeToElapse;
    const options = ["days", "weeks", "months"];
    if (options.indexOf(periodType) == 1) {
        result = timeToElapse * 7;
    };
    let then;
    if (options.indexOf(periodType) == 2) {
        const now = new Date();
        const nowMonth = now.getMonth();
        const nowDate = now.getDate();
        const nowYear = now.getFullYear();
        const nowHour = now.getHours();
        const nowMinutes = now.getMinutes();
        const nowSeconds = now.getSeconds();
        const nowmilliseconds = now.getMilliseconds();
        // const ordinalMonth = nowMonth + 1;
        //add the given months(timeToElapse) to the present month
        const totalMonths = nowMonth + timeToElapse;
        const workingMonth = totalMonths + 1;
        const months30s = [4, 6, 9, 11];
        //get how many years in the future
        if (workingMonth > 12) {
            const addedYears = Math.floor(workingMonth / 12);
            const futureYear = nowYear + addedYears;
            const futureMonths = workingMonth % 12;
            //takes care of future leap year
            if (futureYear % 4 !== 0 && futureMonths == 2 && nowDate > 28) {
                nowDate = 28;
            };
            //takes care of month 30 days and 31 days conflicts
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
    const impactReportedCases = data.reportedCases * 10,
    severeImpactReportedCases = data.reportedCases * 50,
    impactInfectionsByRequestedTime = infectionsByRequestedTime(normaliseIndays(data.periodType, data.timeToElapse), impactReportedCases),
    severeImpactInfectionsByRequestedTime = infectionsByRequestedTime(normaliseIndays(data.periodType, data.timeToElapse), severeImpactReportedCases),
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
export default covid19ImpactEstimator;