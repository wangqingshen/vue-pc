<template>  
    <div id="loading">
    	<div class="loadInner">
    		<img src="../../static/images/loading/three-dots.svg" alt="loading"><br/>
        	<span>数据加载中，请稍后... </span> 
    	</div>  
    	
    </div>  
</template>  

<style scoped>
#loading {
	display: table;
	position: absolute;
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
    z-index: 10;
}
#loading .loadInner {
	display: table-cell;
	vertical-align: middle;
	width: 100%;
	text-align: center;
}
#loading img{
	display: inline-block;
	width: 0.5rem;
    margin-bottom: 0.05rem;
}
#loading span {
	color: #fff;
	font-size: 0.14rem;
}
</style>