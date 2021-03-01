import moment from "moment";
import { message } from "antd";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import Cookies from 'universal-cookie';
import { getCepData } from "../services/AccessServices";

function getToken() {
  const cookies = new Cookies();
  return cookies.get('atualizacao-cadastral-token')
}

async function setToken(token: string) {
  const cookies = new Cookies();
  cookies.remove("atualizacao-cadastral-token")
  cookies.set("atualizacao-cadastral-token", token)
}

function logout() {
  const cookies = new Cookies();
  cookies.remove("atualizacao-cadastral-token")
  localStorage.clear()
}

function responseTokenIsInvalid(response: any) {
  if (response.data!==undefined) {
    return response.data.message!==undefined && response.data.message === "token invalido"
  } else {
    return false
  }
}

function isLogged() {
  let estudanteLocal = localStorage.getItem("usuario")

  if (estudanteLocal !== null && estudanteLocal !== undefined) {
    return true
  }

  return false
}

function getOptions() {
  let retorno = []
  retorno.push({ value: "1", title: "Perda ou Roubo" })
  retorno.push({ value: "2", title: "Cartão com defeito" })
  retorno.push({ value: "3", title: "Cartão danificado" })

  return retorno
}

function getOptionsToFilter() {
  let retorno = []
  retorno.push({ value: "1", text: "Perda ou Roubo" })
  retorno.push({ value: "2", text: "Cartão com defeito" })
  retorno.push({ value: "3", text: "Cartão danificado" })

  return retorno
}

function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getOption(id: String) {
  let retorno = ""
  let options = getOptions()

  options.forEach((it): void => {
    if (it.value === id) {
      retorno = it.title
    }
  })

  return retorno
}

function getDateFromMoment(created_at: string): Date {
  let date = new Date()

  let created = moment(created_at, "YYYY-MM-DD HH:mm:ss")

  date.setFullYear(created.year(), created.month() + 1, created.date())
  date.setHours(created.hour(), created.minute(), created.second())

  return date
}

function date1IsAfterOrEqualThenDate2(date1: Date, date2: Date) {
  let timeDate1 = date1
  let timeDate2 = new Date()
  timeDate2.setFullYear(date2.getFullYear(), date2.getMonth(), date2.getDate() - 1)

  return timeDate1.getTime() > timeDate2.getTime()
}

function maskForDate(date: Date) {
  let retorno = ""

  if (date.getDate() < 10) {
    retorno += ("0" + date.getDate() + "/")
  } else {
    retorno += (date.getDate() + "/")
  }

  if (date.getMonth() < 9) {
    retorno += ("0" + (date.getMonth()) + "/")
  } else {
    retorno += ((date.getMonth()) + "/")
  }
  retorno += date.getFullYear()

  return retorno
}

function validateNome(value: any) {

  if (value.split(" ").length > 1) {
    return true;
  } else {
    message.error("O nome é inválido!");
    return false;
  }
};

function validateEmail(value: any) {
  const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  if (re.test(value.toLowerCase())) {
    return true;
  } else {
    message.error("O e-mail é inválido!");
    return false;
  }
};

function checkDateFieldData(date: string[]) {
  let newDay = "";
  let newMonth = "";
  let newYear = "";

  if (date.length>1) {
    for (let index = 0; index < date[0].length; index++) {
      let element = parseInt(date[0].charAt(index));
      if (!isNaN(element)) {
        newDay += element;
      }
    }
  
    for (let index = 0; index < date[1].length; index++) {
      let element = parseInt(date[1].charAt(index));
      if (!isNaN(element)) {
        newMonth += element;
      }
    }
  
    for (let index = 0; index < date[2].length; index++) {
      let element = parseInt(date[2].charAt(index));
      if (!isNaN(element)) {
        newYear += element;
      }
    }
  
    if (newDay.length<2) {
      return 1
    } else if (newMonth.length<2) {
      return 1
    } else if (newYear.length<4) {
      return 1
    } else {
      return 0
    }
  
  } else {
    return 1
  }
}

function validatePhone(oldValue: any, type: string) {
  let newValue = "";

  for (let index = 0; index < oldValue.length; index++) {
    let element = parseInt(oldValue.charAt(index));
    if (!isNaN(element)) {
      newValue += element;
    }
  }

  if (newValue.length === 11) {
    return true;
  } else {
    if (type==='phone') {
      message.error("O telefone é inválido!");
    } else {
      message.error("O whatsapp é inválido!");
    }
    return false;
  }
};

function validateMaskValue(oldValue: any, sizeExpected: number, field: string) {
  let newValue = "";

  for (let index = 0; index < oldValue.length; index++) {
    let element = parseInt(oldValue.charAt(index));
    if (!isNaN(element)) {
      newValue += element;
    }
  }

  if (newValue.length === sizeExpected) {
    return true;
  } else {
    message.error(`O ${field} é inválido!`);
    return false;
  }
}

function validateCPF(value: any) {

  if (cpfValidator.isValid(value)) {
    return true;
  } else {
    message.error("O CPF é inválido!");
    return false;
  }
};

function validateEscola(value: any) {

  if (value.length > 0) {
    return true;
  } else {
    message.error("O nome da escola é inválido!");
    return false;
  }
};

function getIdUser() {
  let obj = { id: "1" }
  let lsobj = localStorage.getItem("usuario")
  if (lsobj !== undefined && lsobj !== null) {
    obj = JSON.parse(lsobj)
  }

  return obj
}


async function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

async function buscarCep(value: any) {
  // limpar mascara
  const cepvalue = value.toString().replace('.', '').replace('-', '')
  if (cepvalue.length === 8) {
    let response = await getCepData(cepvalue)

    if (response.data.erro === true) {
      message.error('CEP não encontrado');
      return undefined
    } else {
      return (response.data);
    }

  } else if (cepvalue.length < 8) {
    message.error('CEP incompleto');
    return undefined
  }
};

export {
  getToken,
  setToken,
  logout,
  responseTokenIsInvalid,
  isLogged,
  capitalizeFirstLetter,
  getOptions,
  getOptionsToFilter,
  getOption,
  getDateFromMoment,
  maskForDate,
  date1IsAfterOrEqualThenDate2,
  validateNome,
  validateEmail,
  checkDateFieldData,
  validatePhone,
  validateCPF,
  validateMaskValue,
  validateEscola,
  getIdUser,
  getBase64,
  buscarCep
}