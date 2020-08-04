// Fetch samples.JSON data
d3.json("../samples.json").then(function(data) {

    metadata = data.metadata
    samples = data.samples

    var dropdownMenu = d3.select("#selDataset");

    // Dropdown menu - populate County Names
    metadata.forEach(function(individual) {
        var option = dropdownMenu.append("option");
        option.text(individual.id);
    });

    // Refresh data with new selected dropdown id
    dropdownMenu.on("change", updatePlots);
    // Page default
    updatePlots();

    function updatePlots() {
        // get the selected individual id value from the drop down
        var selectedIndividualId = dropdownMenu.property("value");
        
        // Unique ID sample data
        var selectedValue = samples.filter( function( uID ) {
            if( uID.id == selectedIndividualId )
            {
                return uID
            }
        });

        // Sort greatest to least
        var sortedValues = selectedValue.sort(function (a,b) {return d3.descending(a.sample_values, b.sample_values);});
        
        // Top ten from sorted list (vars)
        var top_otu_ids = sortedValues[0].otu_ids.slice(0,10);
        var top_sample_values = sortedValues[0].sample_values.slice(0,10);
        var top_otu_labels = sortedValues[0].otu_labels.slice(0,10);

        var y_labels = []
        Object.entries(top_otu_ids).forEach(([key, value]) => {
            y_labels.push("OTU " + value);
        });

        var data = [{
            type: 'bar',
            x: top_sample_values.reverse(),
            y: y_labels.reverse(),
            orientation: 'h',
            marker: {
                width: 1
            },
            text: top_otu_labels.reverse()
        }];

        // Bar chart title
        var layout = {title: `Bar Chart - Top 10 OTUs found for Individual ${selectedIndividualId}`}
          
        // Plot
        Plotly.newPlot('bar', data, layout);

        // Data point colors for bubbles
        var bubble_colors = ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',
        'rgb(44, 160, 101)', 'rgb(255, 65, 54)',
        'rgb(52, 63, 123)','rgb(135, 12, 73)',
        'rgb(65, 108, 25)', 'rgb(216, 152, 119)',
        'rgb(108, 84, 240)','rgb(216, 84, 240)'];

        var trace_1 = {
            x: top_otu_ids,
            y: top_sample_values,
            text: top_otu_labels,
            mode: 'markers',
            marker: {
              color: bubble_colors,   
              size: top_sample_values
            }
        };
          
        var data = [trace_1];
        
        var layout = {
            title: `Top 10 OTUs found for Individual ${selectedIndividualId}`,
            showlegend: false
        };
        
        var config = {responsive:true}

        // Bubble chart (plot)
        Plotly.newPlot('bubble', data, layout, config);

        
        // selected test subject data
        var testSubjectData = metadata.filter(metadata => metadata.id == selectedIndividualId);
        var metaData = testSubjectData[0];

        // Write dictionary to html tag
        d3.select("#sample-metadata").html("");
        Object.keys(metaData).forEach(function(key) {
            d3.select("#sample-metadata").append("html").html("<b>" + key + "</b>: " + metaData[key]);
        });
    }
});