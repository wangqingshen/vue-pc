<template>  
    <div id="loading">
    	<div class="loadInner">
    		<img src="../../../static/images/loading/oval.svg" alt="loading"><br/>
        	<span>数据加载中，请稍后... </span> 
    	</div>  
    	
    </div>  
</template>  

<style>
#loading {
	display: table;
    width: 100%;
    margin-top: 0.15rem;
    margin-bottom: .15rem;
}
#loading .loadInner {
	display: table-cell;
	vertical-align: middle;
	width: 100%;
	text-align: center;
}
#loading img{
	display: inline-block;
	width: 0.2rem;
    margin-bottom: 0.05rem;
}
#loading span {
	color: #888;
	font-size: 0.12rem;
}
</style>