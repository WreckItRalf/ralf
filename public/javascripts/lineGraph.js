function buildLineGraph(elementID, data, xLabel, yLabel) {
  var chart = c3.generate({
    bindto: elementID,
    data: {
      columns: data
    },
    legend: {
      position: 'right'
    },
    axis: {
      y: {
        show: true,
        label: {
          text: yLabel,
          position: 'outer-middle'
        }
      },
      x: {
        show: true,
        label: {
          text: xLabel,
          position: 'outer-center'
        }
      }
    }
  });
};
