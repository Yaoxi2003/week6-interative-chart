const unpack = (data, key) => data.map(row => row[key]);

Promise.all([
    d3.csv("./sheets/lifeExp.csv"),
    d3.csv("./sheets/death&birth.csv") 
]).then(([lifeRaw, vitalRaw]) => {
    
    const countryList = ['Australia', 'France', 'Japan', 'United States', 'World'];

    const processedData = countryList.map(country => {
        const lifeRows = lifeRaw.filter(d => d.Entity === country);
        const vitalRows = vitalRaw.filter(d => d.Entity === country);

        return {
            name: country,
            years: unpack(lifeRows, 'Year'),
            lifeExp: unpack(lifeRows, 'Life expectancy'),
            deaths: unpack(vitalRows, 'Deaths'),
            births: unpack(vitalRows, 'Births')
        };
    });

    renderChart(processedData);
})


function renderChart(allData) {
    const colors = ['#FB2C36', '#8E51FF', '#FE9A00', '#7CCF00', '#00BC7D']

      const lifeAnnotations = [
    // 1. ww1
    {
        x: 1916, 
        y: allData[1].lifeExp[1916 - allData[1].years[0]] || 40, 
        text: '<b>WWI</b><br>Major impact on Europe',
        showarrow: true,
        arrowhead: 2,
        ax: -40,
        ay: 40, 
        font: { size: 12, color: '#fff' },
        bgcolor: 'rgba(130, 151, 179, 0.9)'
    },

    // 2. ww2
    {
        x: 1945,
        y: 30, 
        text: '<b>WWII Ends</b><br>Global humanitarian crisis',
        showarrow: true,
        arrowhead: 2,
        ax: 10,
        ay: 50,
        font: { size: 12, color: '#fff' },
        bgcolor: 'rgba(130, 151, 179, 0.9)'
    },

    // baby boomers after ww2
    {
        x: 1950,
        y: 60, 
        text: '<b>Post-War Baby Boom</b><br>Postwar population growth',
        showarrow: true,
        arrowhead: 3,
        ax: 50,
        ay: -30,
        font: { size: 12, color: '#fff' },
        bgcolor: 'rgba(130, 151, 179, 0.9)'
    }
    ]   

   const deathAnnotations = [
    {
        x: 1960, 
        y: 54612440, 
        text: '<b>1960 Global Mortality Spike</b><br>Driven by major famines affecting<br>global statistics.',
        showarrow: true, 
        arrowhead: 7, 
        ax: 0, 
        ay: -50,
        font: { color: '#fb2c36', size: 13 },
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        bordercolor: '#fb2c36',
        borderwidth: 1
    }
]

  const birthsAnnotation = [
    {
        x: 1990, 
        y: 143461420, 
        text: '<b>1990 Global Birth Peak</b><br>The absolute historical peak before<br>global fertility decline began.',
        showarrow: true, 
        arrowhead: 7, 
        ax: 0, 
        ay: -50,
        font: { color: '#00BBA7', size: 13 },
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        bordercolor: '#00BBA7',
        borderwidth: 1
    }
]

    const traces = allData.map((d, i) => ({
        x: d.years,
        y: d.lifeExp,
        name: d.name,
        type: 'scatter',
        mode: 'lines',
        line: { color: colors[i], width: 4 },
        hovertemplate: `<b>${d.name}</b><br>Value: %{y}<extra></extra>`
    }));

    const updatemenus = [{
        type: 'dropdown',
        x: 0, y: 1.2,
        buttons: [
            {
                label: 'Life Expectancy',
                method: 'update',
                args: [
                { y: allData.map(d => d.lifeExp) }, 
                { annotations: lifeAnnotations }    
            ]
            },
            {
                label: 'Total Deaths',
                method: 'update',
                args: [
                { y: allData.map(d => d.deaths) }, 
                { annotations: deathAnnotations }    
            ]
            },
            {
                label: 'Total Births',
                method: 'update',
                args: [
                { y: allData.map(d => d.births) }, 
                { annotations: birthsAnnotation }
            ]
            }
        ]
    },
        {
            type: 'buttons',       
            direction: 'left',     
            buttons: [
                { label: 'Lines Only', method: 'restyle', args: ['mode', 'lines'] },
                { label: 'Markers Only', method: 'restyle', args: ['mode', 'markers'] },
                { label: 'Lines + Markers', method: 'restyle', args: ['mode', 'lines+markers'] }
            ],
            showactive: true,     
            x: 0.35,
            y: 1.2,
            xanchor: 'middle',
            yanchor: 'top',
            font: { family: 'Nunito, sans-serif', color: '#45556C' }
        }
];

  
    const layout = {
        updatemenus: updatemenus,
        hovermode: 'closest',
        xaxis: { title: 'Year' },
        yaxis: { title: 'Value', automargin: true },
        annotations: lifeAnnotations,

        font: { family: 'Nunito, sans-serif' },
        margin: { t: 100, b: 80, l: 80, r: 80 }
    };

    Plotly.newPlot('myPlot', traces, layout);
}