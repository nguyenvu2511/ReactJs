import axios from '../axios';

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

const createNewUserService = (data) => {
    console.log('check data from services: ', data)
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (userId) => {
    // return axios.delete('/api/delete-user', {id: userId})
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
}

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData);
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}

const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctors`)
}

const saveDetailDoctorService = (data) => {
    return axios.post('/api/save-info-doctors', data)
}

const getDetailInfoDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', data)
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtraInfoDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`)
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookAppointment = (data) => {
    return axios.post('/api/patient-book-appointment', data)
}

const postVerifyBookAppointment = (data) => {
    return axios.post('/api/verify-book-appointment', data)
}

const createNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data)
}

const getAllSpecialty = () => {
    return axios.get(`/api/get-specialty`)
}

const getAllDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}

const createNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data)
}

const getAllClinic = () => {
    return axios.get(`/api/get-clinic`)
}

const getAllDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`)
}

const createNewHandbook = (data) => {
    return axios.post('/api/create-new-handbook', data)
}

const getAllHandbook = () => {
    return axios.get(`/api/get-handbook`)
}

const getAllDetailHandbookById = (data) => {
    return axios.get(`/api/get-detail-handbook-by-id?id=${data.id}`)
}

const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
}

const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy', data)
}

const postSendCancelBooking = (data) => {
    return axios.post('/api/send-cancel-booking', data)
}

// const getDataCovid = () => {
//     let today = new Date();
//     let dd = today.getDate();
//     let mm = today.getMonth() + 1;
//     let yyyy = today.getFullYear();
//     today = dd + '/' + mm + '/' + yyyy;
//     return axios.get(`https://api.covid19api.com/country/vietnam?from=2021-11-19T00:00:00Z&to=2021-11-27T00:00:00Z`)
// }

const getDataCovid = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    var lastday = yyyy + '-' + mm + '-' + (dd - 8);

    var dataCovid = "https://api.covid19api.com/country/vietnam?from=" + lastday + "T00:00:00Z&to=" + today + "T00:00:00Z";
    // var dataCovid = "https://api.covid19api.com/country/vietnam?from=2021-12-01T00:00:00Z&to="+today;
    return axios.get(dataCovid)
}
const deleteScheduleByDate = (data) => {
    return axios.post('/api/delete-schedule-by-date', data)
}

const deleteClinicById = (data) => {
    return axios.post('/api/delete-clinic-by-id', data)
}
const deleteSpecialty = (data) => {
    return axios.post('/api/delete-specialty', data)
}
const deleteHandbook = (data) => {
    return axios.post('/api/delete-handbook', data)
}

const editClinic = (data) => {
    return axios.post('/api/edit-clinic', data)
}
const editSpecialty = (data) => {
    return axios.post('/api/edit-specialty', data)
}
const editHandbook = (data) => {
    return axios.post('/api/edit-handbook', data)
}

const getAllPatientDone = (data) => {
    return axios.get(`/api/get-list-patient-done?doctorId=${data.doctorId}`)
}
export {
    handleLoginApi, getAllUsers,
    createNewUserService, deleteUserService,
    editUserService, getAllCodeService, getTopDoctorHomeService,
    getAllDoctors, saveDetailDoctorService,
    getDetailInfoDoctor, saveBulkScheduleDoctor,
    getScheduleDoctorByDate, getExtraInfoDoctorById,
    getProfileDoctorById, postPatientBookAppointment,
    postVerifyBookAppointment, createNewSpecialty,
    getAllSpecialty, getAllDetailSpecialtyById,
    createNewClinic, getAllClinic, getAllDetailClinicById,
    createNewHandbook, getAllHandbook, getAllDetailHandbookById,
    getDataCovid, getAllPatientForDoctor, postSendRemedy,
    postSendCancelBooking, deleteScheduleByDate,
    deleteClinicById, deleteSpecialty,
    deleteHandbook, editClinic, editSpecialty, editHandbook,
    getAllPatientDone
}
