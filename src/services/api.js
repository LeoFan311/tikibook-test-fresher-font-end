import axios from '../ultils/axios_customize';

export const callRegister = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user/register', {
        fullName,
        email,
        password,
        phone,
    });
};

export const callLogin = (username, password) => {
    return axios.post('/api/v1/auth/login', {
        username,
        password,
    });
};

export const callFetchAccount = () => {
    return axios.get('/api/v1/auth/account');
};

export const callFetchListUser = (query) => {
    return axios.get(`/api/v1/user?${query}`);
};

export const callLogout = () => {
    return axios.post('/api/v1/auth/logout');
};

export const callCreateUser = (fullName, password, email, phone) => {
    return axios.post('/api/v1/user', {
        fullName,
        password,
        email,
        phone,
    });
};

export const callBulkCreateUser = (data) => {
    return axios.post('/api/v1/user/bulk-create', data);
};

export const callUpdateUser = (_id, fullName, phone) => {
    console.log('Check callUpdateUser res: ', _id, fullName, phone);
    return axios.put('/api/v1/user', { _id, fullName, phone });
};

export const callUpdateUserInfo = (_id, phone, fullName, avatar) => {
    return axios.put('/api/v1/user', { _id, phone, fullName, avatar });
};

export const callChangeUserPassword = (email, oldpass, newpass) => {
    return axios.post('/api/v1/user/change-password', {
        email,
        oldpass,
        newpass,
    });
};

export const callDeleteUser = (userId) => {
    return axios.delete(`/api/v1/user/${userId}`);
};

export const callFetchListBook = (query) => {
    return axios.get(`/api/v1/book?${query}`);
};

export const callFetchListOrder = (query) => {
    return axios.get(`/api/v1/order?${query}`);
};

export const callFetchDashboard = (query) => {
    return axios.get(`/api/v1/database/dashboard`);
};

export const callUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            'Content-Type': 'multipart/form-data',
            'upload-type': 'book',
        },
    });
};

export const callUploadAvatar = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            'Content-Type': 'multipart/form-data',
            'upload-type': 'avatar',
        },
    });
};

export const callCreateBook = (data) => {
    return axios.post(`api/v1/book`, {
        thumbnail: data.thumbnail,
        slider: data.slider,
        mainText: data.mainText,
        author: data.author,
        price: data.price,
        sold: data.sold,
        quantity: data.quantity,
        category: data.category,
    });
};

export const callBookCategory = () => {
    return axios.get(`api/v1/database/category`);
};

export const callUpdateBook = (data) => {
    return axios.put(`api/v1/book/${data._id}`, {
        thumbnail: data.thumbnail,
        slider: data.slider,
        mainText: data.mainText,
        author: data.author,
        price: data.price,
        sold: data.sold,
        quantity: data.quantity,
        category: data.category,
    });
};

export const callDeleteBook = (id) => {
    return axios.delete(`api/v1/book/${id}`);
};

export const callFetchBookById = (id) => {
    return axios.get(`api/v1/book/${id}`);
};

export const callPlaceOrder = (data) => {
    return axios.post(`api/v1/order`, data);
};

export const callOrderHistory = () => {
    return axios.get(`/api/v1/history`);
};
