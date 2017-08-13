/**
 * Created by cz on 2017/8/8.
 */
new Vue({
    el:"#app",
    data: {
        totalMoney:0,
        productlist:[],
        checkAllFlag: false,
        checkedNum : 0,
        delFlag:false,
        curProduct:''
    },
    //局部过滤器，只能当前实例使用
    filters:{
        formatMoney:function (value) {
            return "￥ "+value.toFixed(2);
        }
    },
    mounted:function () {
        this.$nextTick(function () {
            this.cartView();
        });
    },
    methods: {
        cartView:function () {
            var _this = this;
            this.$http.get('data/cartData.json',{id:123}).then(function(res){
                _this.productlist = res.body.result.list;
                _this.productlist.forEach(function(item){
                    //_this.$set(item,"checked",'false');
                    item.checked = false;
                });
                // _this.totalMoney = res.body.result.totalMoney;
            })
        },
        changeMoney:function (product,way) {
            if(way>0){
                product.productQuentity++;
            }else{
                product.productQuentity--;
                if( product.productQuentity<1){
                    return product.productQuentity=1;
                }
            }
            this.calTotalPrice();
        },
        selectedProduct:function (item) {
            var _this = this;
            item.checked = item.checked ? false : true;
            if(item.checked){
                this.checkedNum++;
            }else{
                this.checkedNum--;
            }
            if(this.checkedNum==this.productlist.length){
                _this.checkAllFlag = true;
            }else{
                _this.checkAllFlag = false;
            }
            this.calTotalPrice();

        },
        checkAll:function () {
            var _this = this;
            // console.log(_this.checkAllFlag)

            if(this.checkAllFlag) {
                this.productlist.forEach(function (item, index) {
                    item.checked = false;
                })
                _this.checkAllFlag = false;
                this.checkedNum = 0;
            }else{
                this.productlist.forEach(function (item, index) {
                    item.checked = true;
                })
                _this.checkAllFlag = true;
                this.checkedNum = this.productlist.length;
            }
            this.calTotalPrice();
        },
        removeAll:function () {
            var _this = this;
            this.productlist.forEach(function (item, index) {
                item.checked = false;
            })
            this.checkAllFlag = false;
            this.checkedNum = 0;
            this.calTotalPrice();
        },
        calTotalPrice:function () {
            var _this = this;
            this.totalMoney = 0;
            this.productlist.forEach(function (item,index) {
                if(item.checked){
                    _this.totalMoney += item.productPrice*item.productQuentity;
                }
            })
        },
        delConfirm:function (item) {
            this.delFlag = true;
            this.curProduct = item;
        },
        delProduct:function () {
            var index = this.productlist.indexOf(this.curProduct);
            this.productlist.splice(index,1);
            this.delFlag = false;
        }
    },
});
//全局过滤器
Vue.filter("money",function (value,type) {
    return "￥ "+value.toFixed(2)+type;
})
