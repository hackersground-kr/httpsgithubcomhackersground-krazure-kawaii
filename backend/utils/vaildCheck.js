function validEmailCheck(email) {
  var pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  
  return !pattern.test(email);
}

function validBirthCheck(birth) {
  var pattern =  /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

  return !pattern.test(birth);
}

function validInterface(obj, interfaceCheck) {
  for (const key in interfaceCheck) {
    if (!obj.hasOwnProperty(key) || typeof obj[key] !== typeof interfaceCheck[key]) {
      return false;
    }
  }
  return true;
}

function validType(value, validTypes) {
  return validTypes.includes(value);
}

module.exports = {
  validEmailCheck,
  validBirthCheck,
  validInterface,
  validType
}