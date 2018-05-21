<template>
        <!-- <div class='key-title'>请输入金额</div>
        <div class='input-box'>{{inputType }}</div>{{message}} -->
        <div class='keyboard' @click.stop='_handleKeyPress'>
            <div class='key-row'>
                <div class='key-cell' data-num='7'>7</div>
                <div class='key-cell' data-num='8'>8</div>
                <div class='key-cell' data-num='9'>9</div>
                <div class='key-cell' data-num='-1'>删除</div>
            </div>
            <div class='key-row'>
                <div class='key-cell' data-num='4'>4</div>
                <div class='key-cell' data-num='5'>5</div>
                <div class='key-cell' data-num='6'>6</div>
                <div class='key-cell' data-num='-1'>清空</div>
            </div>
            <div class='key-row'>
                <div class='key-cell' data-num='1'>1</div>
                <div class='key-cell' data-num='2'>2</div>
                <div class='key-cell' data-num='3'>3</div>
                <div class='key-cell' data-num='-1'></div>
            </div>                      
            <div class='key-row'>
                <div class='key-cell disabled' data-num='0' >0</div>
                <div class='key-cell' data-num='00'>00</div>
                <div class='key-cell' data-num='.'>.</div>
               
                <div class='key-cell' data-num='-1'></div>
            </div>
            <!-- <div class='key-confirm' data-num='S'>确认</div> -->
            <div class='key-clear' data-num='C'>清空</div>
            <div class='key-delete' data-num='D'>删除</div>
        </div>
</template>

<script>
    // import Bus from '../../bus';
    export default{
        name: 'Keyboard',
        props:['message','inputType','backMoney'],
    	data(){
    		return{
				money : ''
            }
        },
        methods : {
			//处理按键
			_handleKeyPress(e) {
				let num = e.target.dataset.num;
				//不同按键处理逻辑
				// -1 代表无效按键，直接返回
                //undefined按到没有键的空隙了
				if (num == -1) return false;
                if (num == undefined) return false;
				switch (String(num)) {
					//小数点
					case '.':
						this._handleDecimalPoint();
						break;
					//删除键
					case 'D':
						this._handleDeleteKey();
						break;
					//清空键
					case 'C':
						this._handleClearKey();
						break;
					//确认键
					case 'S':
						this._handleConfirmKey();
						break;
                    case '':                       
                        break;
					default:
						this._handleNumberKey(num);
						break;
				}
			},
			//处理小数点函数
			_handleDecimalPoint() {
				//如果包含小数点，直接返回
                if(this.inputType==0){//0表示文本输入梳理
                    this.money +='.'                   
                }else if(this.inputType==1){//1表示输入金额，保留两个位小数
                    if (this.money.indexOf('.') > -1) return false;
                        //如果小数点是第一位，补0
                    if (!this.money.length)
                        this.money = '0.';
                    //如果不是，添加一个小数点
                    else
                        this.money = this.money + '.';
                }else if(this.inputType==2){//2表示输入数字
                    this.money +=''
                    
                }
				this.$emit('confirmEvent', this.money)
			},
			//处理删除键
			_handleDeleteKey() {
				let S = this.money;
				//如果没有输入，直接返回
				if (!S.length) return false;
				//否则删除最后一个
				this.money = S.substring(0, S.length - 1);
                this.$emit('confirmEvent', this.money)
			},
			//处理清空键
			_handleClearKey() {
				this.money = '';
                this.$emit('confirmEvent', this.money)
			},
			//处理数字
			_handleNumberKey(num) {
				let S = this.money;

                if(this.inputType==0){//0表示文本输入梳理
                        this.money = S + num
                }else if(this.inputType==1){//1表示输入金额，保留两个位小数
                        //如果有小数点且小数点位数不小于2
                    if ( S.indexOf('.') > -1 && S.substring(S.indexOf('.') + 1).length < 2)
                        this.money = S + num;
                        //没有小数点
                    if (!(S.indexOf('.') > -1)) {
                        //如果第一位是0，只能输入小数点
                        if (num == 0 && S.length == 0)
                            this.money = '0.';
                        else {
                            if (S.length && Number(S.charAt(0)) === 0) return;
                                this.money = S + num;
                        }
                    }
                }else if(this.inputType==2){//2表示输入数字 
                    if(S.length==0||S==0){
                        if(num==0){
                            this.money = ''
                        }else{
                            this.money = S + num                                                
                        }
                    }else{
                        this.money = S + num
                    }
                }				
                this.$emit('confirmEvent', this.money)
			}
			//提交
			// _handleConfirmKey() {
   //              let S = this.money;
			// 	//未输入
			// 	if (!this.money.length){
			// 		this.$alert('您还没有输入数值', '',{
   //                    confirmButtonText: '确定',
   //                    showClose:false,
   //                    confirmButtonClass:'confirmInput'
   //                  });
			// 		return false;
			// 	}else{
   //                  if(this.inputType==0){//0表示文本输入梳理
   //                      return
   //                  }else if(this.inputType==1){//1表示输入金额，保留两个位小数
   //                      if (S.indexOf('.') > -1 && S.indexOf('.') == (S.length - 1))
   //                          S = Number(S.substring(0, S.length - 1)).toFixed(2);
   //                          //保留两位
   //                          S = Number(S).toFixed(2);
   //                  }else if(this.inputType==2){//2表示输入数字
   //                      S = Number(S).toFixed(0);
   //                  }
   //              }                
			// 	//将 8. 这种转换成 8.00
				
			// 	this.$emit('confirmEvent',S)  
   //              this.money=''             
			// }

        },
        watch:{
          message(){
            this.money=''           
          },
          backMoney(){
            this.money=this.backMoney
          }  
        }
    }
</script>

<style scoped>
    .keyboard {
        width: 100%;
        height:100%;
        position: relative;
        display: flex;
        display : -webkit-flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }
    .keyboard .key-row {
        display: flex;
        flex: 1;
        width: 100%;
        display: -webkit-flex;
        position: relative;
    }
    .keyboard .key-row::before {
       /* content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #d5d5d6;
        color: #d5d5d6;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);*/
    }
    .keyboard .key-cell {
        flex: 1;
        display: flex;
        justify-content: space-around;
        align-items: center;
        -webkit-box-flex: 1;
        position: relative;
        border: 1px solid #f4f4f4;
        border-radius: 5px;
        font-size: 0.18rem;
        color: #333333;
        margin: 2px;
    }
    .keyboard .key-cell:hover, .keyboard .key-delete:hover, .keyboard .key-clear:hover{
        cursor: pointer;
        background-color: #eee;
    }
    .keyboard .key-cell::after {
       /* content: '';
        position: absolute;
        overflow: hidden;
        top: 0;
        right: 0;
        bottom: 0;
        height: 200%;
        border-right: 1px solid #d5d5d6;
        color: #d5d5d6;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);*/
    }
    .keyboard .key-cell:nth-last-child(1)::after {
      /*  border-right: 0;*/
    }
    .keyboard .key-delete,.keyboard .key-clear {
        position: absolute;
        height: 49%;
        width: 24%;
        background: #fff;
        z-index: 5;
        bottom: 0;
        right: 0; 
        box-sizing: border-box;
        padding: 0 0.2rem;
        text-align: center;
        border: 1px solid #f4f4f4;
        border-radius: 5px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        text-align: center;
        font-size: 0.18rem;
        color: #333333;
        cursor: pointer;
    }
    .keyboard .key-delete {
        top: 0;
        right: 0; 
    }
</style>