const infByReqTime = (elapsedTime, cInf) => {
  const numOfThreesInElapsedTime = Math.floor(elapsedTime / 3);
  const extraDays = elapsedTime % 3;
  const part1CurrentlyInfected = cInf * (2 ** numOfThreesInElapsedTime);
  const part2CurrentlyInfected = (part1CurrentlyInfected / 72) * extraDays;
  return Math.floor(part1CurrentlyInfected + part2CurrentlyInfected);
};
const inDays = (periodType, timeToElapse) => {
  let result = timeToElapse;
  if (periodType === 'days') {
    result = timeToElapse * 1;
  } else if (periodType === 'weeks') {
    result = timeToElapse * 7;
  } else if (periodType === 'months') {
    result = timeToElapse * 30;
  }
  return result;
};
const covid19ImpactEstimator = (data) => {
  const impactRC = data.reportedCases * 10;
  const sImpactRC = data.reportedCases * 50;
  const normalTTE = inDays(data.periodType, data.timeToElapse);
  const impactInfByRT = infByReqTime(normalTTE, impactRC);
  const sImpactInfByRT = infByReqTime(normalTTE, sImpactRC);
  const impactSCByRT = Math.floor(0.15 * impactInfByRT);
  const sImpactSCByRT = Math.floor(0.15 * sImpactInfByRT);
  const availableBeds = Math.floor(0.35 * data.totalHospitalBeds);
  const impactHBByRT = availableBeds - (Math.floor(0.15 * impactInfByRT));
  const sImpactHBByRT = availableBeds - (Math.floor(0.15 * sImpactInfByRT));
  const impactCForICUByRT = Math.floor(0.05 * impactInfByRT);
  const sImpactCForICUByRT = Math.floor(0.05 * sImpactInfByRT);
  const myltp = impactInfByRT * data.region.avgDailyIncomePopulation;
  const impactDInF = Math.floor(myltp * data.timeToElapse);
  const multp2 = sImpactInfByRT * data.region.avgDailyIncomePopulation;
  const sImpactDInF = Math.floor(multp2 * data.timeToElapse);
  const impactVent = Math.floor(0.02 * impactInfByRT);
  const sImpactVent = Math.floor(0.02 * sImpactInfByRT);
  return {
    data,
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
  };
};
export default covid19ImpactEstimator;
