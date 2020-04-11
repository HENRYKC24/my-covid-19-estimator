const infByReqTime = (elapsedTime, cInf) => {
  const exponent = Math.trunc(elapsedTime / 3, 10);
  return cInf * (2 ** exponent);
};
const inDays = (periodType, timeToElapse) => {
  let result = timeToElapse;
  if (periodType === 'days') {
    result = timeToElapse;
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
  const normalTTE = Math.trunc(inDays(data.periodType, data.timeToElapse));
  const impactInfByRT = Math.trunc(infByReqTime(normalTTE, impactRC));
  const sImpactInfByRT = Math.trunc(infByReqTime(normalTTE, sImpactRC));
  const impactSCByRT = Math.trunc(0.15 * impactInfByRT);
  const sImpactSCByRT = Math.trunc(0.15 * sImpactInfByRT);
  const availableBeds = 0.35 * data.totalHospitalBeds;
  const impactHBByRT = Math.trunc(availableBeds - (0.15 * impactInfByRT));
  const sImpactHBByRT = Math.trunc(availableBeds - (0.15 * sImpactInfByRT));
  const impactCForICUByRT = Math.trunc(0.05 * impactInfByRT);
  const sImpactCForICUByRT = Math.trunc(0.05 * sImpactInfByRT);
  const impactVent = Math.trunc((0.02 * impactInfByRT / 10));
  const sImpactVent = Math.trunc((0.02 * sImpactInfByRT / 50));
  const myltp = impactInfByRT * data.region.avgDailyIncomePopulation;
  const impactDInF = Math.trunc(myltp * normalTTE * data.region.avgDailyIncomeInUSD);
  const multp2 = sImpactInfByRT * data.region.avgDailyIncomePopulation;
  const sImpactDInF = Math.trunc(multp2 * normalTTE * data.region.avgDailyIncomeInUSD);
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
