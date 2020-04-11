const infByReqTime = (elapsedTime, cInf) => {
  const exponent = parseInt(elapsedTime / 3);
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
  const normalTTE = parseInt(inDays(data.periodType, data.timeToElapse));
  const impactInfByRT = parseInt(infByReqTime(normalTTE, impactRC));
  const sImpactInfByRT = parseInt(infByReqTime(normalTTE, sImpactRC));
  const impactSCByRT = parseInt(0.15 * impactInfByRT);
  const sImpactSCByRT = parseInt(0.15 * sImpactInfByRT);
  const availableBeds = 0.35 * data.totalHospitalBeds;
  const impactHBByRT = parseInt(availableBeds - (0.15 * impactInfByRT));
  const sImpactHBByRT = parseInt(availableBeds - (0.15 * sImpactInfByRT));
  const impactCForICUByRT = parseInt(0.05 * impactInfByRT);
  const sImpactCForICUByRT = parseInt(0.05 * sImpactInfByRT);
  const myltp = impactInfByRT * data.region.avgDailyIncomePopulation;
  const impactDInF = parseInt(myltp * normalTTE * data.region.avgDailyIncomeInUSD);
  const multp2 = sImpactInfByRT * data.region.avgDailyIncomePopulation;
  const sImpactDInF = parseInt(multp2 * normalTTE * data.region.avgDailyIncomeInUSD);
  const impactVent = parseInt(0.02 * impactInfByRT);
  const sImpactVent = parseInt(0.02 * sImpactInfByRT);
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
