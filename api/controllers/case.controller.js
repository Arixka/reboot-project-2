const { CaseModel } = require('../models/case.model')
const { TreatmentModel } = require('../models/treatment.Model.js')
const { TestModel } = require('../models/test.model')

exports.getAllCases = (req, res) => {
  CaseModel
    .find(prepareQuery(req.query))
    .then((cases) => {
      if (cases) {
        res.status(200).json(cases)
      } else {
        res.status(404).json({ msg: 'Resource not found' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ msg: 'Error in Server' })
    })
}

exports.createCase = (req, res) => {
  CaseModel
    .create(req.body)
    .then((cases) => {
      res.status(200).json(cases)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ msg: 'Error in Server' })
    })
}

exports.getCasebyId = (req, res) => {
  CaseModel
    .findById(req.params.caseId)
    .then((cases) => {
      if (cases) {
        res.status(200).json(cases)
      } else {
        res.status(404).json({ msg: 'Resource not found' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ msg: 'Error in Server' })
    })
}

exports.deleteCase = (req, res) => {
  CaseModel
    .findByIdAndDelete(req.params.caseId)
    .then((cases) => {
      if (cases) {
        res.status(200).json(cases)
      } else {
        res.status(404).json({ msg: 'Resource not found' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ msg: 'Error in Server' })
    })
}

exports.updateCase = (req, res) => {
  CaseModel
    .findByIdAndUpdate(req.params.caseId, req.body, { new: true })
    .then((cases) => {
      if (cases) {
        res.status(200).json(cases)
      } else {
        res.status(404).json({ msg: 'Resource not found' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ msg: 'Error in Server' })
    })
}

exports.getAllTestInCase = (req, res) => {
  CaseModel
    .findById(req.params.caseId)
    .populate('tests')
    .then((cases) => {
      if (cases) {
        res.status(200).json(cases.tests)
      } else {
        res.status(404).json({ msg: 'Resource not found' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ msg: 'Error in Server' })
    })
}

// TODO Refactorizar
exports.addTestInCase = (req, res) => {
  CaseModel
    .findById(req.params.caseId)
    .then((cases) => {
      if (cases) {
        const tests = cases.tests.find(t => t._id.toString() === req.body.testId)
        if (!tests) {
          cases.tests.push(req.body.testId)
          cases.save(function (err) {
            if (err) {
              res.status(500).json({ msg: 'Error in Server' })
            } else {
              res.status(200).json(cases)
            }
          })
        } else {
          res.status(409).json({ msg: 'Resource already exists' })
        }
      } else {
        res.status(409).json({ msg: 'Resource already exists' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ msg: 'Error in Server' })
    })
}


// TODO refactorizar
exports.addTreatmentsInCase = (req, res) => {
  CaseModel
    .findById(req.params.caseId)
    .then((cases) => {
      if (cases) {
        const treatment = cases.treatments.find(treatment => treatment._id.toString() === req.body.treatmentId)
        if (!treatment) {
          cases.treatments.push(req.body.treatmentId)
          cases.save(function (err) {
            if (err) {
              res.status(500).json({ msg: 'Error in Server' })
            } else {
              res.status(200).json(cases)
            }
          })
        } else {
          res.status(409).json({ msg: 'Resource already exists' })
        }
      } else {
        res.status(404).json({ msg: 'Resource not found' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ msg: 'Error in Server' })
    })
}

exports.getTreatmentsInCase = (req, res) => {
  CaseModel
    .findById(req.params.caseId)
    .populate('treatments')
    .then((cases) => {
      if (cases) {
        res.status(200).json(cases.treatments)
      } else {
        res.status(404).json({ msg: 'Resource not found' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ msg: 'Error in Server' })
    })
}

exports.createTreatmentInCase = async (req, res) => {
  const treatment = req.body
  try {
    const cases = await CaseModel.findById(req.params.caseId)
    if (cases) {
      const newTreat = await TreatmentModel.create(treatment)
      cases.treatments.push(newTreat._id)
      await cases.save()
      res.status(200).json(newTreat)
    } else {
      res.status(404).json({ msg: 'Resource does not exist' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in Server' })
  }
}

// TODO Refactorizar
exports.createTestInCase = (req, res) => {
  const test = req.body
  CaseModel
    .findById(req.params.caseId)
    .populate('test')
    .then((cases) => {
      if (cases) {
        TestModel
          .create(test)
          .then(newTest => {
            cases.tests.push(newTest)
            cases.save(function (err) {
              if (err) {
                res.status(500).json({ msg: 'Error in Server' })
              } else {
                res.status(200).json(newTest)
              }
            })
          })
      } else {
        res.status(404).json({ msg: 'Resource does not exist' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ msg: 'Error in Server' })
    })
}


// TODO Refactorizar
exports.deleteTreatmentCase = (req, res) => {
  CaseModel
    .findById(req.params.caseId)
    .populate('treatments')
    .then(cases => {
      let treatment
      if (cases && (treatment = cases.treatments.find(c => c._id.toString() === req.params.treatmentId))) {
        cases.treatments = cases.treatments.filter(c => c._id.toString() !== req.params.treatmentId)
        treatment.remove()
        cases.save()
          .then(cases => res.status(200).json(cases.treatments))
          .catch(error => {
            console.log(error)
            res.status(500).json({ msg: 'Error in Server' })
          })
      } else {
        res.status(404).json({ msg: 'Resource does not exist' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ msg: 'Error in Server' })
    })
}

// TODO Refactorizar
exports.deleteTestCase = (req, res) => {
  CaseModel
    .findById(req.params.caseId)
    .populate('tests')
    .then(cases => {
      let test
      if (cases && (test = cases.tests.find(t => t._id.toString() === req.params.testId))) {
        cases.tests = cases.tests.filter(t => t._id.toString() !== req.params.testId)
        test.remove()
        cases.save()
          .then(cases => res.status(200).json(cases.tests))
          .catch(error => {
            console.log(error)
            res.status(500).json({ msg: 'Error in Server' })
          })
      } else {
        res.status(404).json({ msg: 'Resource does not exist' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ msg: 'Error in Server' })
    })
}

function prepareQuery(query) {
  const resultQuery = {}
  if (query.hasOwnProperty('date')) resultQuery.date = query.date

  if (query.hasOwnProperty('vet')) resultQuery.vet = query.vet

  return resultQuery
}
