// ESTE ARCHIVO ES PARA MANEJAR LA CONFIG DEL DATASET

const dataset_url = "https://gist.githubusercontent.com/Bastiangs/ae53bbff1ca6db84d32e1f0408824319/raw/8d279bdd2b93cda57bfc66f6891f1b414cf5fd5e/data_publishers.json"

let data

function loadDataset(data_url) {
    d3.json(data_url).then((dataset) => {
        data = dataset
        console.log("json:", data.children)

        const nodes = d3.hierarchy(dataset)
        const filter_data = nodes.descendants().filter((d) => d.depth == 1 && d.data.parent == "Raiz")
        
        console.log("nodos:", nodes)
        console.log("nodos publishers:", filter_data)

        handleCheckbox(filter_data)
        // createCircularPacking(filter_data, new Array())
        // createBox(filter_data, new Array())
    })
}

loadDataset(dataset_url)
