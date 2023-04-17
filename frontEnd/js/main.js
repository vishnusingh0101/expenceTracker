
window.onload = async () => {
    try{
        const exp = await axios.get('http://localhost:3000/allExpence');
        const allExpence = exp.data;
        for(expence of allExpence) {
            setValueInUi(expence, expence.id);
        }
    }catch(err) {
        console.log(err);
    };
}

async function saveToLocal(event) {
    event.preventDefault();
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('descp').value;
    const category = document.getElementById('expence').value;
    let obj = {
        amount,
        description,
        category
    }
    const exp = await axios.post('http://localhost:3000/add-expence', obj);
    try{
        const id = exp.data.id;
        // localStorage.setItem(obj.desp, JSON.stringify(obj));
        setValueInUi(obj, id);
    }
    catch(err) {
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
        const exp = axios.delete('http://localhost:3000/delete/'+ id);
        try{
            console.log(exp);
            // localStorage.removeItem(obj.desp);
            expList.removeChild(li);
        }catch(err) {
            console.log(err);
        };
    };


    let amt = document.getElementById('amount');
    let desp = document.getElementById('descp');
    let expence = document.getElementById('expence');

    //edit onclick function
    edit.onclick = () => {
        var button = document.getElementById('button');
        if(button.innerHTML === 'Submit'){
            button.innerHTML = "Update";
            desp.value = obj.description;
            amount.value = obj.amount;
            expence.value = obj.category;
            button.onclick = (event) =>{
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
                const exp = axios.post('http://localhost:3000/edit', newObj);
                try{
                    console.log(exp);
                    expList.removeChild(li);
                    setValueInUi(newObj, id);
                }catch(err) {
                    console.log(err);
                };
                button.innerHTML = "Submit";
                button.onclick = "saveToLocal(event)";
            }
        }
        
    }
    
    let li = document.createElement('li');
    li.textContent = 'Amount: '+obj.amount+' Description : '+obj.description+' Category: '+obj.category;
    li.appendChild(del);
    li.appendChild(edit);
    expList.appendChild(li);
    amt.value = '';
    desp.value = '';
    expence.value = '';
}