const storeToken = (value) => {
    if(value){
        const { access, refresh } = value;
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
    }
}

const getToken = () => {
    let access = localStorage.getItem('access');
    let refresh = localStorage.getItem('refresh');
    return { access, refresh }
}

const removeToken = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
}

const storePayment = (value) => {
    if(value){
        localStorage.setItem('payment', JSON.stringify(value));
    }
}

const getPayment = () => {
    const  res = localStorage.getItem('payment');
    return JSON.parse(res)
}



export { storeToken, getToken, removeToken, storePayment, getPayment} 


