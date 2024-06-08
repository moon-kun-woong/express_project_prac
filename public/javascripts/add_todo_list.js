const btn = document.getElementById('btn');
let addValue = document.getElementById('addValue');
let result = document.getElementById('result');

function addWork(){
    if(addValue.value == ""){
        alert("내용 입력 바람.");
    } else {
        let list = document.createElement("li");
        let work = document.createAttribute("button");

        list.innerHTML = addValue.value;
        result.appendChild(list);
        list.appendChild(work);
        work.innerText = "x";
        work.style.fontSize = "20px";
        work.style.border = "none";
        work.style.float = "right";
        work.style.right = "17px";
        work.style.marginTop = "10px";
        work.style.cursor = "pointer";
        work.addEventListener("click", deleteList);
        work.style.position='relative';
        }
    }

function allClearList(e){
    if(confirm("정말 삭제하시겠습니까?")==true){ 
        if(result.innerText==''){
            alert("삭제할 목록이 없습니다"); 
        }else{
            result.innerText='';
        }
    }else{
        return false;
    }
}