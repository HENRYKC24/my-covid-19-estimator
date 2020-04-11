const infByReqTime = (elapsedTime, cInf) => {
  const exponent = Number.parseInt(elapsedTime / 3);
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
  const normalTTE = Number.parseInt(inDays(data.periodType, data.timeToElapse));
  const impactInfByRT = Number.parseInt(infByReqTime(normalTTE, impactRC));
  const sImpactInfByRT = Number.parseInt(infByReqTime(normalTTE, sImpactRC));
  const impactSCByRT = Number.parseInt(0.15 * impactInfByRT);
  const sImpactSCByRT = Number.parseInt(0.15 * sImpactInfByRT);
  const availableBeds = 0.35 * data.totalHospitalBeds;
  const impactHBByRT = Number.parseInt(availableBeds - (0.15 * impactInfByRT));
  const sImpactHBByRT = Number.parseInt(availableBeds - (0.15 * sImpactInfByRT));
  const impactCForICUByRT = Number.parseInt(0.05 * impactInfByRT);
  const sImpactCForICUByRT = Number.parseInt(0.05 * sImpactInfByRT);
  const myltp = impactInfByRT * data.region.avgDailyIncomePopulation;
  const impactDInF = Number.parseInt(myltp * normalTTE * data.region.avgDailyIncomeInUSD);
  const multp2 = sImpactInfByRT * data.region.avgDailyIncomePopulation;
  const sImpactDInF = Number.parseInt(multp2 * normalTTE * data.region.avgDailyIncomeInUSD);
  const impactVent = Number.parseInt(0.02 * impactInfByRT);
  const sImpactVent = Number.parseInt(0.02 * sImpactInfByRT);
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
