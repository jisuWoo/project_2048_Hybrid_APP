window.onload = function(){
    var result = document.getElementById("result");
    logoutbtn.style.display = "none";

    loginbtn.addEventListener('click', function(){
        var inputvalue = document.getElementById("input").value;
        if(inputvalue == "d"){
            loginbtn.style.display = "none";
            logoutbtn.style.display = "block";

            result_txt.innerText = "이은석";
            var img = document.createElement("img");
            img.src = "https://vr.yuhan.ac.kr/bbs/file/getImageDirect.do?subFilePath=professor&fileName=professor_file_1_49039211373641942.JPG";
            result.appendChild(img);
        }
    });
    logoutbtn.addEventListener('click', function(){
        loginbtn.style.display = "block";
        logoutbtn.style.display = "none";
        result.innerText = "";
    });
}
var arr = ["자기소개 : 안녕하세요, 이은석 교수님이지요. 게임 공학 분야의 교육자로, 혁신적이고 독특한 교육 방식을 통해 학생들을 인도합니다.게임 개발의 비밀과 아름다움을 탐험하고, 학생들이 창의적으로 문제를 해결하며 능력을 키우도록 격려합니다. 협업과 팀워크를 강조하며, 학생들과 함께 게임 개발의 새로운 세계를 탐험합니다.출처 : chatgpt",
"이은석교수님에 대한 소감: 이은석 교수님의 강의와 지도는 마치 마법처럼 환상적입니다. 그의 독특한 교육 방식은 학생들에게 현실적인 경험을 제공하고, 게임 개발의 실무 스킬을 강화합니다. 그 덕분에 게임 개발의 세계를 더 깊이 이해하고 미래의 게임 개발자로서 뛰어난 역량을 갖추게 되었습니다. 이은석 교수님과 함께한 시간은 정말 값진 경험이었습니다.출처 : chatgpt",""];
function swap(a,b){
    var temp = "";
    if(arr[a] == ""){
        if(d3.innerText == "저장하셨습니다"){
            alert("내용이 없습니다.");
        }else{
            for(var i = 0; i<3; i++){
                if(arr[i] == b){
                    temp = arr[a];
                    arr[a] = arr[i];
                    arr[i] = temp;
                    d3.innerText = "저장하셨습니다";
                }
            }
        }
    }else{
        d3.innerText = arr[a];
    }
}