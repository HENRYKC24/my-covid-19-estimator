const takeWholeNum = (x) => {
  const textVersion = String(x);
  if (textVersion.indexOf('.') < 0) {
    return Number(textVersion);
  } else {
    const index = textVersion.indexOf('.');
    return Number(textVersion.slice(0, index));
  }
};
const infByReqTime = (elapsedTime, cInf) => {
  const exponent = takeWholeNum(elapsedTime / 3);
  return cInf * (2 ** exponent);
};
const inDays = (periodType, timeToElapse) => {
  let result;
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
  const normalTTE = takeWholeNum(inDays(data.periodType, data.timeToElapse));
  const impactInfByRT = takeWholeNum(infByReqTime(normalTTE, impactRC));
  const sImpactInfByRT = takeWholeNum(infByReqTime(normalTTE, sImpactRC));
  const impactSCByRT = takeWholeNum(0.15 * impactInfByRT);
  const sImpactSCByRT = takeWholeNum(0.15 * sImpactInfByRT);
  const availableBeds = 0.35 * data.totalHospitalBeds;
  const impactHBByRT = takeWholeNum(availableBeds - (0.15 * impactInfByRT));
  const sImpactHBByRT = takeWholeNum(availableBeds - (0.15 * sImpactInfByRT));
  const impactCForICUByRT = takeWholeNum(0.05 * impactInfByRT);
  const sImpactCForICUByRT = takeWholeNum(0.05 * sImpactInfByRT);
  const impactVent = takeWholeNum((0.02 * impactInfByRT));
  const sImpactVent = takeWholeNum((0.02 * sImpactInfByRT));
  const myltp = impactInfByRT * data.region.avgDailyIncomePopulation;
  const impactDInF = takeWholeNum(myltp * data.region.avgDailyIncomeInUSD) / normalTTE;
  const multp2 = sImpactInfByRT * data.region.avgDailyIncomePopulation;
  const sImpactDInF = takeWholeNum(multp2 * data.region.avgDailyIncomeInUSD) / normalTTE;
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
