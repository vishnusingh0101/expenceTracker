
window.onload = async () => {
    const token = localStorage.getItem('token');
    try {
        const premium = axios.get('http://localhost:3000/premium/ispremium', { headers: { "Authorization": token } });
        const exp = axios.get('http://localhost:3000/user/allExpence', { headers: { "Authorization": token } });


        Promise.all([premium, exp])
            .then(([premium, exp]) => {
                const ispremium = premium.data.premium;
                if (ispremium === true) {
                    displayForPremium();
                }
                const allExpence = exp.data.expence;
                if (exp.data.success == true) {
                    for (expence of allExpence) {
                        setValueInUi(expence, expence.id);
                    }
                } else {
                    document.getElementById('outputMsg').innerText = exp.error;
                    setTimeout(() => {
                        document.getElementById('outputMsg').innerText = '';
                    }, 4000);
                }
            })
            .catch(err => console.log(err));


    } catch (err) {
        console.log(err);
    };
}

async function saveToLocal(event) {
    event.preventDefault();
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('descp').value;
    const category = document.getElementById('expence').value;
    const token = localStorage.getItem('token');
    let obj = {
        amount,
        description,
        category
    }
    const exp = await axios.post('http://localhost:3000/user/addExpence', obj, { headers: { "Authorization": token } });
    try {
        const id = exp.data.id;
        // localStorage.setItem(obj.desp, JSON.stringify(obj));
        setValueInUi(obj, id);
    }
    catch (err) {
        console.log(err);
    }
}
function setValueInUi(obj, id) {
    var expList = document.getElementById('expList');

    //delete button here
    var del = document.createElement('input');
    del.className = 'btn delete btn-danger';
    del.type = 'button';
    del.value = 'Delete';
    del.style.marginLeft = '10px';

    //edit button here
    var edit = document.createElement('input');
    edit.className = 'btn edit btn-primary';
    edit.type = 'button';
    edit.value = 'edit';
    edit.style.marginLeft = '10px';



    //delete onclick function
    del.onclick = () => {
        const token = localStorage.getItem('token');
        const exp = axios.delete('http://localhost:3000/user/delete/' + id + '/' + obj.amount, { headers: { "Authorization": token } });
        try {
            console.log(exp);
            expList.removeChild(li);
        } catch (err) {
            console.log(err);
        };
    };


    let amt = document.getElementById('amount');
    let desp = document.getElementById('descp');
    let expence = document.getElementById('expence');

    //edit onclick function
    edit.onclick = () => {
        var button = document.getElementById('submitBtn');
        const token = localStorage.getItem('token');
        if (button.innerHTML === 'Submit') {
            button.innerHTML = "Update";
            desp.value = obj.description;
            amount.value = obj.amount;
            expence.value = obj.category;
            button.onclick = (event) => {
                event.preventDefault();
                const amount = document.getElementById('amount').value;
                const description = document.getElementById('descp').value;
                const category = document.getElementById('expence').value;
                let newObj = {
                    id,
                    amount,
                    description,
                    category
                }
                console.log(newObj);
                const exp = axios.post('http://localhost:3000/user/edit', newObj, { headers: { "Authorization": token } });
                try {
                    console.log(exp);
                    expList.removeChild(li);
                    setValueInUi(newObj, id);
                } catch (err) {
                    console.log(err);
                };
                button.innerHTML = "Submit";
                button.onclick = "saveToLocal(event)";
            }
        }

    }

    let li = document.createElement('li');
    li.textContent = 'Amount: ' + obj.amount + ' Description : ' + obj.description + ' Category: ' + obj.category;
    li.appendChild(del);
    li.appendChild(edit);
    expList.appendChild(li);
    amt.value = '';
    desp.value = '';
    expence.value = '';
}

document.getElementById('rzpButton').onclick = async function (e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/premium/premiummembership', { headers: { "Authorization": token } });
    console.log(response);
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            await axios.post('http://localhost:3000/premium/updateTransactionStatus', {
                payment_id: response.razorpay_payment_id,
                order_id: options.order_id,
            }, { headers: { "Authorization": token } })
            alert('Welcome to the premium features');
            displayForPremium();
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment.failed', (responce) => {
        console.log(responce);
        alert('Something went wrong')
    })
}

async function displayForPremium() {
    document.getElementById('premiumButton').removeChild(document.getElementById('rzpButton'));

    //premium confirmation through h4
    const h4 = document.createElement('h4');
    h4.innerHTML = "You are a premium user now";
    h4.style.color = 'Gold';

    //leaderBord buton
    const leaderBord = document.createElement('button');
    leaderBord.id = 'leaderbordShow';
    leaderBord.className = 'premiumpageBtn';
    leaderBord.innerText = 'Show Leaderbord';

    //Download report button
    const downloadexpence = document.createElement('button');
    downloadexpence.id = 'downloadexpense';
    downloadexpence.className = 'premiumpageBtn';
    downloadexpence.innerText = 'Download report';

    //Download report button
    const totalReport = document.createElement('button');
    totalReport.id = 'totalReport';
    totalReport.className = 'premiumpageBtn';
    totalReport.innerText = 'Report History';

    //adding to DOM
    document.getElementById('premiumButton').appendChild(h4);
    document.getElementById('premiumButton').appendChild(leaderBord);
    document.getElementById('premiumButton').appendChild(downloadexpence);
    document.getElementById('premiumButton').appendChild(totalReport);

    let leaderBordDisplayed = false;

    //onclick feature for leaderBord
    document.getElementById('leaderbordShow').onclick = async function (e) {
        if (leaderBordDisplayed === false) {
            e.preventDefault();
            let leaderBordList = document.getElementById('leaderbord');

            const getUser = await axios.get('http://localhost:3000/premium/showleaderbord');
            try {
                const users = getUser.data.leaderborddata;

                for (let i = 0; i < users.length; i++) {
                    let li = document.createElement('li');
                    li.textContent = 'Name: ' + users[i].name + '  ' + ' TotalExpence: ' + users[i].totalExpence;
                    leaderBordList.appendChild(li);
                }
                leaderBordDisplayed = true;
                leaderBord.innerText = 'Hide Leaderbord';
                leaderBord.id = 'leaderbordHide';
            } catch (err) {
                console.log(err);
            }
        }

    }

    //onclick feature for report
    downloadexpence.onclick = async () => {
        const token = localStorage.getItem('token');
        console.log(token);
        axios.get('http://localhost:3000/user/download', { headers: { "Authorization": token } })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    //the bcakend is essentially sending a download link
                    //  which if we open in browser, the file would download
                    var a = document.createElement("a");
                    a.href = response.data.fileURL;
                    a.download = 'myexpense.csv';
                    a.click();
                } else {
                    throw new Error(response.data.message)
                }

            })
            .catch((err) => {
                console.log(err);
            });
    }
    totalReport.onclick = () => {
        window.location.href = "file:///C:/Users/Vishnu/Desktop/web%20devlopment/expenceTracker/frontEnd/html/report.html";
    }

    document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'leaderbordHide') {
            e.preventDefault();
            leaderBordDisplayed = false;
            leaderBord.innerText = 'Show Leaderbord';
            leaderBord.id = 'leaderbordShow';
            let leaderBordul = document.getElementById('leaderbord');
            leaderBordul.innerHTML = '';
        }
    });
}