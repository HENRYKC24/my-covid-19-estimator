const infByReqTime = (elapsedTime, cInf) => {
  const numOfThreesInElapsedTime = Math.floor(elapsedTime / 3);
  const extraDays = elapsedTime % 3;
  const part1CurrentlyInfected = cInf * (2 ** numOfThreesInElapsedTime);
  const part2CurrentlyInfected = (part1CurrentlyInfected / 72) * extraDays;
  return Math.round(part1CurrentlyInfected + part2CurrentlyInfected);
};
const inDays = (periodType, timeToElapse) => {
  let result = timeToElapse;
  const options = ['days', 'weeks', 'months'];
  if (options.indexOf(periodType) === 1) {
      result = timeToElapse * 7;
  }
  let then;
  if (options.indexOf(periodType) === 2) {
    const now = new Date();
    const nowMonth = now.getMonth();
    let nowDate = now.getDate();
    const nowYr = now.getFullYear();
    const nowHr = now.getHours();
    const nowMins = now.getMinutes();
    const nowSecs = now.getSeconds();
    const nowMilSecs = now.getMilliseconds();
    const totalMonths = nowMonth + timeToElapse;
    const workingMonth = totalMonths + 1;
    const months30s = [4, 6, 9, 11];
    if (workingMonth > 12) {
      const addedYrs = Math.floor(workingMonth / 12);
      const fYr = nowYr + addedYrs;
      const fMonths = workingMonth % 12;
      if (fYr % 4 !== 0 && fMonths === 2 && nowDate > 28) {
          nowDate = 28;
      }
      if (months30s.indexOf(fMonths) > -1 && nowDate === 31) {
          nowDate = 30;
      }
      then = new Date(fYr, fMonths, nowDate, nowHr, nowMins, nowSecs, nowMilSecs);
    } else {
      const fYr = nowYr;
      const fMonths = nowMonth + timeToElapse;
      then = new Date(fYr, fMonths, nowDate, nowHr, nowMins, nowSecs, nowMilSecs);
    }
    const timeDifferenceInMilliseconds = then.getTime() - now.getTime();
    result = Math.ceil(timeDifferenceInMilliseconds / 86400000);
  };
  return result;
};

const covid19ImpactEstimator = (data) => {
  const impactRC = data.reportedCases * 10;
  const sImpactRC = data.reportedCases * 50;
  const normalTTE = inDays(data.periodType, data.timeToElapse);
  const impactInfByRT = infByReqTime(normalTTE, impactRC);
  const sImpactInfByRT = infByReqTime(normalTTE, sImpactRC);
  const impactSCByRT = Math.round(0.15 * impactInfByRT);
  const sImpactSCByRT = Math.round(0.15 * sImpactInfByRT);
  const availableBeds = Math.round(0.35 * data.totalHospitalBeds);
  const impactHBByRT =  availableBeds - (Math.round(0.15 * impactInfByRT));
  const sImpactHBByRT = availableBeds - (Math.round(0.15 * sImpactInfByRT));
  const impactCForICUByRT = Math.round(0.05 * impactInfByRT);
  const sImpactCForICUByRT = Math.round(0.05 * sImpactInfByRT);
  const myltp = impactInfByRT * data.region.avgDailyIncomePopulation;
  const impactDInF = Math.floor(myltp * data.timeToElapse);
  const multp2 = sImpactInfByRT * data.region.avgDailyIncomePopulation;
  const severImpactDollarsInFlight = Math.floor(multp2 * data.timeToElapse);
  const impactVent = Math.round(0.02 * impactInfByRT);
  const sImpactVent = Math.round(0.02 * sImpactInfByRT);
  return {
    data: data,
    impact: {
      currentlyInfected: impactRC,
      infectionsByRequestedTime: impactInfByRT,
      severeCasesByRequestedTime: impactSCByRT,
      hospitalBedsByRequestedTime: impactHBByRT,
      casesForICUByRequestedTime: impactCForICUByRT,
      casesForVentilatorsByRequestedTime: impactVent,
      dollarsInFlight: impactDInF
    },
    severeImpact: {
      currentlyInfected: sImpactRC,
      infectionsByRequestedTime: sImpactInfByRT,
      severeCasesByRequestedTime: sImpactSCByRT,
      hospitalBedsByRequestedTime: sImpactHBByRT,
      casesForICUByRequestedTime: sImpactCForICUByRT,
      casesForVentilatorsByRequestedTime: sImpactVent,
      dollarsInFlight: sImpactDInF
    }
  }
};
export default covid19ImpactEstimator;
