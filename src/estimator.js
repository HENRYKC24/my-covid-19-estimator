const infByReqTime = (elapsedTime, cInf) => {
  const exponent = parseInt(elapsedTime / 3, 10);
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
  const normalTTE = parseInt(inDays(data.periodType, data.timeToElapse), 10);
  const impactInfByRT = parseInt(infByReqTime(normalTTE, impactRC), 10);
  const sImpactInfByRT = parseInt(infByReqTime(normalTTE, sImpactRC), 10);
  const impactSCByRT = parseInt(0.15 * impactInfByRT, 10);
  const sImpactSCByRT = parseInt(0.15 * sImpactInfByRT, 10);
  const availableBeds = 0.35 * data.totalHospitalBeds;
  const impactHBByRT = parseInt(availableBeds - (0.15 * impactInfByRT), 10);
  const sImpactHBByRT = parseInt(availableBeds - (0.15 * sImpactInfByRT), 10);
  const impactCForICUByRT = parseInt(0.05 * impactInfByRT, 10);
  const sImpactCForICUByRT = parseInt(0.05 * sImpactInfByRT, 10);
  const myltp = impactInfByRT * data.region.avgDailyIncomePopulation;
  const impactDInF = parseInt(myltp * normalTTE * data.region.avgDailyIncomeInUSD, 10);
  const multp2 = sImpactInfByRT * data.region.avgDailyIncomePopulation;
  const sImpactDInF = parseInt(multp2 * normalTTE * data.region.avgDailyIncomeInUSD, 10);
  const impactVent = parseInt(0.02 * impactSCByRT, 10);
  const sImpactVent = parseInt(0.02 * sImpactSCByRT, 10);
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
