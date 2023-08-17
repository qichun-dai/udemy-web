async function drawLineChart() {

  //read data
    
  const data = await d3.json("./data/unemployment.json");
  console.log(data)

  const yAccessor = d => d.unemployment
  console.log(yAccessor(data[0]))

  const dateParse = d3.timeParse("%m/%d/%Y")
  const xAccessor = d=> dateParse(d.date)


  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 500,
    margin: {
      top: 15,
      right:15,
      bottom: 110,
      left: 50,
    },
    margin2:{
      top: 435,
      right:15,
      bottom: 20,
      left: 50,
    }
  }

  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
  dimensions.boundedHeight2 = dimensions.height - dimensions.margin2.top - dimensions.margin2.bottom
  console.log(dimensions.margin2.left)


  const yScale = d3.scaleLinear()
  .domain([0,d3.max(data,yAccessor)])
  .range([dimensions.boundedHeight,0])

  const yScale2 = d3.scaleLinear()
  .domain([0,d3.max(data,yAccessor)])
  .range([dimensions.boundedHeight2,0])

  const xScale = d3.scaleTime()
    .domain(d3.extent(data,xAccessor))
    .range([0,dimensions.boundedWidth])

    console.log(xScale.domain())

  const xScale2 = d3.scaleTime()
    .domain(d3.extent(data,xAccessor))
    .range([0,dimensions.boundedWidth])

  const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const focus = wrapper.append("g")
  .attr("class", "focus")
  .style("transform",`translate(
    ${dimensions.margin.left}px,
    ${dimensions.margin.top}px
  )`)

  console.log(focus)

  const context = wrapper.append("g")
  .attr("class", "context")
  .style("transform", `translate(
    ${dimensions.margin2.left}px,
    ${dimensions.margin2.top}px
  )`)

  console.log(context)

  focus.append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", dimensions.boundedWidth)
      .attr("height", dimensions.boundedHeight)


  const lineGenerator = d3.line()
  .x(d => xScale(xAccessor(d))) 
  .y(d => yScale(yAccessor(d)))


  const lineGenerator2 = d3.line()
  .x(d => xScale2(xAccessor(d))) 
  .y(d => yScale2(yAccessor(d)))

      
  const maxUnemployment=yScale(d3.max(data,yAccessor))
  
  const recessions = focus.append("rect")
      .attr("x",xScale(dateParse("12/01/2007")))
      .attr("width", xScale(dateParse("06/01/2009"))-xScale(dateParse("12/01/2007")))
      .attr("y",maxUnemployment)
      .attr("height",dimensions.boundedHeight-maxUnemployment)
      .attr("fill","#e0f3f3")

  const line = focus.append("path")
  .attr("class","line")
  .attr("id","line")
  .attr("d", lineGenerator(data))
  .attr("fill","none")
  .attr("stroke","gray")
  .attr("stroke-width",1.5)
  .attr("clip-path","url(#clip)")



  const line2 = context.append("path")
  .attr("class","line")
  .attr("d", lineGenerator2(data))
  .attr("fill","none")
  .attr("stroke","gray")
  .attr("stroke-width",1.5)


// draw axes
  const yAxisGenerator = d3.axisLeft()
          .scale(yScale)

  const yAxis = focus.append("g")
  .attr("class","y-axis")
  .call(yAxisGenerator)



  const xAxisGenerator = d3.axisBottom()
  .scale(xScale)

          
  const xAxis = focus.append("g")
  .attr("class","x-axis")
  .call(xAxisGenerator)
  .style("transform",`translateY(
    ${dimensions.boundedHeight}px
  )`)    
  
  const xAxisGenerator2 = d3.axisBottom()
  .scale(xScale2)


  const xAxis2 = context.append("g")
  .attr("class","x-axis")
  .call(xAxisGenerator2)
  .style("transform",`translateY(
    ${dimensions.boundedHeight2}px
  )`)               

  const brush = d3.brushX()
  .handleSize(10)
    .extent([[0,0],[dimensions.boundedWidth,dimensions.boundedHeight]])
    .on("brush", brushed)

  context.append("g")
  .attr("class", "brush")
  .call(brush)
  

  //.call(brush.move, xScale.range())

  // context.append("g")
  //       .attr("class", "x brush")
  //       .call(brush)
  //     .selectAll("rect")
  //       .attr("y", -6)
  //       .attr("height", height2 + 7)

  function brushed(event) {
    console.log(xScale.domain())
    console.log(event.selection.map(xScale.invert))
    // if (event.sourceEvent && event.sourceEvent.type === "zoom") return
    // console.log("brush",brush.extent())

    // xScale.domain(brush.extent())
    
    //focus.select(".x.axis").call(xAxis)
    console.log(event)

    xScale.domain(event.selection.map(xScale2.invert))
    console.log(xScale.domain())
  

    focus.select(".x-axis").call(xAxisGenerator)

    // focus.select(".line")
    //   .attr("d",line)


        // x.domain(brush.empty() ? x2.domain() : brush.extent());

    // focus.select(".line")
    //   .attr("d", lineGenerator(data))
    line.attr("d", lineGenerator(data))

  }
  
          
}

drawLineChart()