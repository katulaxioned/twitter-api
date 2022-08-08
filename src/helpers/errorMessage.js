exports.errorMessages = {
  routeNotFound: {
    code: 'Resource Not Found',
    message: 'Resource Not Found.',
  },
  internalServerError: {
    code: 'Internal Server Error',
    message: 'Internal Server Error.',
  },
  noPostDataProvided: {
    code: 'Bad Request',
    message: 'No Data Was Posted.',
  },
  noParamsDataProvided: {
    code: 'Bad Request',
    message: 'No Params Data Was Posted.',
  },
  duplicateDataProvided: {
    code: 'Bad Request',
    message: 'Duplicate Data Provided.',
  },
  noDataExist: {
    code: 'Bad Request',
    message: 'Data doesn\'t exist',
  },  
  dbError: {
    code: 'Database connection error',
    message: 'Operation failed',
  },
  duplicateUserProvided: {
    code: 'Bad Request',
    message: 'User already exists, Duplicate User Data Provided.',
  },
  noUserExist: {
    code: 'Bad Request',
    message: 'User doesn\'t exist',
  },
  wrongPassword: {
    code: 'Bad Request',
    message: 'Password don\'t match. Invalid Login credentials.',
  },
  unauthorized: {
    code: 'Bad Request',
    message: 'You are Unauthorized'
  }
};
