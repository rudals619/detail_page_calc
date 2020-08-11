$(document).ready(function(){
    $("#crush").change(function(){
        var sel = $(this).val();
        $(".result_opt1").text(sel);
    });
    $("#gram").change(function(){
        var sel = $(this).val();
        $(".result_opt2").text(sel);
    });
    var str_price = $(".det_price span").text();
    var num_price = parseFloat(str_price.replace(",",""));
    var total = 0; //총금액의 숫자형데이터
    var final_total = ""; //총금액의 문자형데이터, 최후에 던질 값
    var each_price = 0;
    var each_calc_price = []; //기본값, 대기값, 배열데이터 (ex 원두 1개의 가격)
    var amount = [];//각아이템별수량
    var each_total_price = []; //최종값, (ex 원두 10개의 가격)//이후 옵션가 포함 가격 배열데이터 저장


    $(".total_price_num span").text(total); //수량을 봐야하기때문에, 초기의 총금액
      
    var each_box = `
        <li class="my_item">
            <div class="det_count">
                <div class="det_count_tit">
                    <p class="opt_01">원두(분쇄없음)</p>
                    <p class="opt_02">200g</p>                                
                </div>
                <div class="det_count_bx">
                    <a class="minus" href="#">－</a>
                    <input type="text" value="1" readonly>
                    <a class="plus" href="#">＋</a>
                </div>
                <div class="det_count_price"><span class="each_price">14,000</span>원</div>
                <div class="item_del"><span>×</span></div>
            </div>
        </li>
    `;
    

    function calc_price(){//각항목에대한추가
        total = 0; //값이추가되는부분을막아야함
        for(i=0;i<each_total_price.length;i++){
            total += each_total_price[i]; //최종배열데이터내부의모든값을더한다
        };
        final_total = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(".total_price_num span").text(final_total);
        if(total == 0){ //전체합산이 0이라면
            $(".det_total_price").hide();
            /*
            $("select option").prop("selected", false); //
            $("select option:eq(0)").prop("selected", true); //선택을필수항목으로변경한다.
            */
        }else{
            $(".det_total_price").show();
        }
    }

    $(document).on("click",".item_del", function(){
        var del_index = $(this).closest("li").index();
        each_total_price.splice(del_index, 1); //제거splice(인덱스) & 나머지는돌려준다.
        each_calc_price.splice(del_index, 1);
        amount.splice(del_index, 1);
        $(this).closest("li").remove();      
        calc_price();              
        //returnfalse는 적어주지 않는다!
    });    

    $(".form_crush select").change(function(){ //얘를써주지않고 html창에 diasble만 적으면 다른라인을선택해도 옵션창이막혀있음 disabled삭제(필수항목을선택하지못하도록)
        $(".form_gram select").removeAttr("disabled");
    });
    //조건 1 셀렉트 박스가 선택이 된 상태 후 -> 2번 셀렉트 박스가 선택이 되었을 때 change 이벤트를 걸어 각 세부항목인 .my_item을 ul 아래의 마지막 자식에 추가함
    $(".form_gram select").change(function(){
        $(".opt_box").append(each_box);
        var opt_01 = $("#crush option:selected").text();
        console.log("나의첫번째선택:"+opt_01);
        var opt_02 = $("#gram option:selected").text();
        console.log("나의두번째선택:"+opt_02);
        var opt_02_val = parseFloat($(".form_gram select").val());        
        console.log("나의두번째선택밸유값:"+opt_02_val);
        $(".opt_box li:last .opt_01").text(opt_01);
        $(".opt_box li:last .opt_02").text(opt_02);
        present_price = num_price + opt_02_val; //기본가+옵션가
        console.log(present_price); 
        each_total_price.push(present_price);//옵션가 포함 가격 배열데이터 저장
        console.log(each_total_price); 
        each_calc_price.push(present_price);//+, -클릭시 수량과 함께 계산해야할 데이터(고정값)
        console.log(each_calc_price);
        amount.push(1); //초기수량
        console.log("원본수량 : " , amount);
        var result_opt = present_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(".opt_box li:last .each_price").text(result_opt);
        calc_price();
    });

    //각 아이템 박스의 -를 클릭시
    $(document).on("click", ".minus", function(){    
        var $index = $(this).closest("li").index();
        if(amount[$index] != 1){
            amount[$index]--;
            console.log(amount);
            $(this).siblings("input").val(amount[$index]); //감소수량을표기
            each_total_price[$index] = each_calc_price[$index] * amount[$index]; //숫자형데이터 = 기본값 * 수량
            console.log(each_total_price);
            console.log(each_calc_price);
            var result_price = each_total_price[$index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");//문자형
            $(this).closest(".det_count_bx").siblings(".det_count_price").find(".each_price").text(result_price);           
            calc_price();
        }
        return false; 
    });

    //각 아이템 박스의 +를 클릭시
    $(document).on("click", ".plus", function(){
        var $index = $(this).closest("li").index();
        amount[$index]++;
        console.log("수량 : " , amount); //뒤에 인덱스를 빼줘야버튼을눌렀을때배열값으로가져와짐
        $(this).siblings("input").val(amount[$index]); //증가수량을표기
        each_total_price[$index] = each_calc_price[$index] * amount[$index]; //숫자형데이터
        console.log(each_total_price);
        console.log(each_calc_price);
        var result_price = each_total_price[$index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");//문자형
        $(this).closest(".det_count_bx").siblings(".det_count_price").find(".each_price").text(result_price);
        calc_price();
        return false;
    });

    $(".each_price").click("")

    
    

});