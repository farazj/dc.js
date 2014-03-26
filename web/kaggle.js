/********************************************************
*                                                       *
*   dj.js example using Yelp Kaggle Test Dataset        *
*   Eamonn O'Loughlin 9th May 2013                      *
*                                                       *
********************************************************/
 
/********************************************************
*                                                       *
*   Step0: Load data from json file                     *
*                                                       *
********************************************************/
d3.csv("faraz3.csv", function (data) {
     
/********************************************************
*                                                       *
*   Step1: Create the dc.js chart objects & ling to div *
*                                                       *
********************************************************/
var bubbleChart = dc.bubbleChart("#dc-bubble-graph");
var pieChart = dc.pieChart("#dc-pie-graph");
var volumeChart = dc.barChart("#dc-volume-chart");
var lineChart = dc.lineChart("#dc-line-chart");
var dataTable = dc.dataTable("#dc-table-graph");
var rowChart = dc.rowChart("#dc-row-graph");
 
/********************************************************
*                                                       *
*   Step2:  Run data through crossfilter                *
*                                                       *
********************************************************/
var ndx = crossfilter(data);
     
/********************************************************
*                                                       *
*   Step3:  Create Dimension that we'll need            *
*                                                       *
********************************************************/
 
//"date","tstmp","pred_dir","SAR_SIG","RANGE","SAR2SIG","WRANGE","CSAR","CSAR_SIG","port","sig_dur","mtm","sr1","sr2","sr3","lag_sr1","lag_sr2","lag_sr3","fd1","fd2","fd3","open","close"

    // for volumechart
    var dateDimension = ndx.dimension(function (d) { return d.date; });
    var dateGroup = dateDimension.group();
    var dateDimensionGroup = dateDimension.group().reduce(
        //add
        function(p,v){
            ++p.count;
            p.csar_sr_sum += v.CSAR_SIG * v.y_sr_opp;
            p.csar_fd_sum += v.CSAR_SIG * v.y_fd_opp;

            p.s1_sr_sum += Math.round(v.sr1) * v.y_sr_opp;
            p.s1_fd_sum += Math.round(v.sr1) * v.y_fd_opp;
            p.s2_sr_sum += Math.round(v.sr2) * v.y_sr_opp;
            p.s2_fd_sum += Math.round(v.sr2) * v.y_fd_opp;
            p.s3_sr_sum += Math.round(v.sr3) * v.y_sr_opp;
            p.s3_fd_sum += Math.round(v.sr3) * v.y_fd_opp;
            
            p.ls1_sr_sum += Math.round(v.lag_sr1) * v.y_sr_opp;
            p.ls1_fd_sum += Math.round(v.lag_sr1) * v.y_fd_opp;
            p.ls2_sr_sum += Math.round(v.lag_sr2) * v.y_sr_opp;
            p.ls2_fd_sum += Math.round(v.lag_sr2) * v.y_fd_opp;
            p.ls3_sr_sum += Math.round(v.lag_sr3) * v.y_sr_opp;
            p.ls3_fd_sum += Math.round(v.lag_sr3) * v.y_fd_opp;
            
            p.f1_sr_sum += Math.round(v.fd1) * v.y_sr_opp;
            p.f1_fd_sum += Math.round(v.fd1) * v.y_fd_opp;
            p.f2_sr_sum += Math.round(v.fd2) * v.y_sr_opp;
            p.f2_fd_sum += Math.round(v.fd2) * v.y_fd_opp;
            p.f3_sr_sum += Math.round(v.fd3) * v.y_sr_opp;
            p.f3_fd_sum += Math.round(v.fd3) * v.y_fd_opp;
            
            return p;
        },
        //remove
        function(p,v){
            --p.count;
            p.csar_sr_sum -= v.CSAR_SIG * v.y_sr_opp;
            p.csar_fd_sum -= v.CSAR_SIG * v.y_fd_opp;

            p.s1_sr_sum -= Math.round(v.sr1) * v.y_sr_opp;
            p.s1_fd_sum -= Math.round(v.sr1) * v.y_fd_opp;
            p.s2_sr_sum -= Math.round(v.sr2) * v.y_sr_opp;
            p.s2_fd_sum -= Math.round(v.sr2) * v.y_fd_opp;
            p.s3_sr_sum -= Math.round(v.sr3) * v.y_sr_opp;
            p.s3_fd_sum -= Math.round(v.sr3) * v.y_fd_opp;
            
            p.ls1_sr_sum -= Math.round(v.lag_sr1) * v.y_sr_opp;
            p.ls1_fd_sum -= Math.round(v.lag_sr1) * v.y_fd_opp;
            p.ls2_sr_sum -= Math.round(v.lag_sr2) * v.y_sr_opp;
            p.ls2_fd_sum -= Math.round(v.lag_sr2) * v.y_fd_opp;
            p.ls3_sr_sum -= Math.round(v.lag_sr3) * v.y_sr_opp;
            p.ls3_fd_sum -= Math.round(v.lag_sr3) * v.y_fd_opp;
            
            p.f1_sr_sum -= Math.round(v.fd1) * v.y_sr_opp;
            p.f1_fd_sum -= Math.round(v.fd1) * v.y_fd_opp;
            p.f2_sr_sum -= Math.round(v.fd2) * v.y_sr_opp;
            p.f2_fd_sum -= Math.round(v.fd2) * v.y_fd_opp;
            p.f3_sr_sum -= Math.round(v.fd3) * v.y_sr_opp;
            p.f3_fd_sum -= Math.round(v.fd3) * v.y_fd_opp;
            return p;
        },
        //init
        function(p,v){
            return {count:0, s1_sr_sum: 0, s1_fd_sum: 0, s2_sr_sum: 0, s2_fd_sum: 0, s3_sr_sum: 0, s3_fd_sum: 0, ls1_sr_sum: 0, ls1_fd_sum: 0, ls2_sr_sum: 0, ls2_fd_sum: 0, ls3_sr_sum: 0, ls3_fd_sum: 0, 
                f1_sr_sum: 0, f1_fd_sum: 0, f2_sr_sum: 0, f2_fd_sum: 0, f3_sr_sum: 0, f3_fd_sum: 0};
        }
    );
 
    // for pieChart
    var startValue = ndx.dimension(function (d) {
        return d.stars*1.0;
    });
    var startValueGroup = startValue.group();
 
    // For datatable
    var businessDimension = ndx.dimension(function (d) { return d.business_id; });
/********************************************************
*                                                       *
*   Step4: Create the Visualisations                    *
*                                                       *
********************************************************/
     
 bubbleChart.width(650)
            .height(300)
            .dimension(cityDimension)
            .group(cityDimensionGroup)
            .transitionDuration(1500)
            .colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"])
            .colorDomain([-12000, 12000])
         
            .x(d3.scale.linear().domain([0, 5.5]))
            .y(d3.scale.linear().domain([0, 5.5]))
            .r(d3.scale.linear().domain([0, 2500]))
            .keyAccessor(function (p) {
                return p.value.star_avg;
            })
            .valueAccessor(function (p) {
                return p.value.review_avg;
            })
            .radiusValueAccessor(function (p) {
                return p.value.count;
            })
            .transitionDuration(1500)
            .elasticY(true)
            .yAxisPadding(1)
            .xAxisPadding(1)
            .label(function (p) {
                return p.key;
                })
            .renderLabel(true)
            .renderlet(function (chart) {
                rowChart.filter(chart.filter());
            })
            .on("postRedraw", function (chart) {
                dc.events.trigger(function () {
                    rowChart.filter(chart.filter());
                });
                        });
            ;
 
 
pieChart.width(200)
        .height(200)
        .transitionDuration(1500)
        .dimension(startValue)
        .group(startValueGroup)
        .radius(90)
        .minAngleForLabel(0)
        .label(function(d) { return d.data.key; })
        .on("filtered", function (chart) {
            dc.events.trigger(function () {
                if(chart.filter()) {
                    console.log(chart.filter());
                    volumeChart.filter([chart.filter()-.25,chart.filter()-(-0.25)]);
                    }
                else volumeChart.filterAll();
            });
        });
 
volumeChart.width(230)
            .height(200)
            d.transitionDuration(1500)
            .centerBar(true)    
            .gap(17)
            .x(d3.scale.linear().domain([0.5, 5.5]))
            .elasticY(true)
            .on("filtered", function (chart) {
                dc.events.trigger(function () {
                    if(chart.filter()) {
                        console.log(chart.filter());
                        lineChart.filter(chart.filter());
                        }
                    else
                    {lineChart.filterAll()}
                });
            })
            .xAxis().tickFormat(function(v) {return v;});   
 
console.log(startValueGroup.top(1)[0].value);
 
lineChart.width(230)
        .height(200)
        .dimension(startValue)
        .group(startValueGroup)
        .x(d3.scale.linear().domain([0.5, 5.5]))
        .valueAccessor(function(d) {
            return d.value;
            })
            .renderHorizontalGridLines(true)
            .elasticY(true)
            .xAxis().tickFormat(function(v) {return v;});   ;
 
rowChart.width(340)
            .height(850)
            .dimension(cityDimension)
            .group(cityGroup)
            .renderLabel(true)
            .colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"])
            .colorDomain([0, 0])
            .renderlet(function (chart) {
                bubbleChart.filter(chart.filter());
            })
            .on("filtered", function (chart) {
                dc.events.trigger(function () {
                    bubbleChart.filter(chart.filter());
                });
                        });
 
 
dataTable.width(800).height(800)
    .dimension(businessDimension)
    .group(function(d) { return "List of all Selected Businesses"
     })
    .size(100)
    .columns([
        function(d) { return d.name; },
        function(d) { return d.city; },
        function(d) { return d.stars; },
        function(d) { return d.review_count; },
        function(d) { return '<a href=\"http://maps.google.com/maps?z=12&t=m&q=loc:' + d.latitude + '+' + d.longitude +"\" target=\"_blank\">Map</a>"}
    ])
    .sortBy(function(d){ return d.stars; })
    // (optional) sort order, :default ascending
    .order(d3.ascending);
/********************************************************
*                                                       *
*   Step6:  Render the Charts                           *
*                                                       *
********************************************************/
             
    dc.renderAll();
});