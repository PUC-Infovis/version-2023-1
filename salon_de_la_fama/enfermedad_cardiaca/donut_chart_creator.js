function chart_creator(age, total){
    d3.json("donut_chart.json").then(function(data) {
     generate_chart(data[age], total)
    console.log('data enviada',age) })
    
}
