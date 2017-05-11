$(function(){ 
    d3.csv('data/data2.csv', function(error, data){
        console.log(data);
        var prepData = d3.nest()
			.key(function(d) { return d.car;})
			.rollup(function(d) {
				return d3.sum(d, function(g) { return g.count; });
			}).entries(data);

        console.log(prepData);

        var donutChart = DonutChart().title('Car Types');
        console.log(donutChart);
        var chart ;
    
        $('button').on('click', function(){
            var height = $('#height').val();
            var width = $('#width').val();
            donutChart.height(height).width(width);
            chart =  d3.select("#vis").datum([prepData])
                .call(donutChart);
            return false;
        });
        

    });
});