/*
Hice este archivo aparte para obtener la lista filtrada y la
subí a un Gist porque sino se demoraba más en cargar (9seg vs 3seg)
el circle packing. Tal vez lo debamos cambiar para que no sea "feo"
*/

const dataset_file = "games.json"

// Almacenamos los publishers más conocidos por nosotros
const most_known_publishers = [
    "Valve",
    "Xbox Game Studios",
    "Warner Bros. Interactive Entertainment",
    "Warner Bros. Games",
    "CAPCOM Co., Ltd.",
    "Capcom",
    "BANDAI NAMCO Entertainment",
    "Electronic Arts",
    "Team17 Digital Ltd",
    "SEGA",
    "PlayStation PC LLC",
    "Ubisoft",
    "Rockstar Games",
    "Devolver Digital",
    "Annapurna Interactive",
    "Activision",
    "Spike Chunsoft Co., Ltd.",
    "2K",
    "Square Enix",
    "Klei Entertainment"
]

const publisher_images = [
    "https://upload.wikimedia.org/wikipedia/commons/a/ab/Valve_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/52/Xbox_Game_Studios.svg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d2/Warner_Bros._%282019%29_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/58/Warner_Bros._Games.svg",
    "https://upload.wikimedia.org/wikipedia/commons/e/ef/Capcom_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/e/ef/Capcom_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/c/cf/Bandai_Namco_Entertainment_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/6/64/Electronic_Arts_logo_black.svg",
    "https://www.team17.com/wp-content/themes/framework/assets/svg/team17-logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/1/13/SEGA_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/5c/PlayStation_logo_and_wordmark.svg",
    "https://upload.wikimedia.org/wikipedia/commons/7/78/Ubisoft_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/53/Rockstar_Games_Logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/4/42/Devolver_Digital_logo.svg",
    "https://upload.wikimedia.org/wikipedia/en/5/5f/Annapurna_Pictures_logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/0/01/Activision.svg",
    "https://www.spike-chunsoft.com/wp-content/themes/spike-chunsoft/images/logo-footer.png",
    "https://upload.wikimedia.org/wikipedia/commons/1/1f/2K_2021_Logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f5/Square_Enix_Logo1.svg",
    "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Klei_Entertainment.svg/1200px-Klei_Entertainment.svg.png"
]

// Se crea la clase Node para poder formar el arbol
class Node {
    constructor(node_name, parent) {
        this.name = node_name
        this.parent = parent
        this.children = []
    }

    add_child(child) {
        if (!arrayIncludesArray(this.children.map((node) => node["name"]), child['name'])) {
            this.children.push(child)
        }
    }
}

// Esta función se encarga de saber si una lista pertenece a un lista de listas
function arrayIncludesArray(array1, array2) {
    let array_exists = false
    array1.map((el) => {
        if (_.isEqual(el, array2)) {
            array_exists = true
        }
    })
    return array_exists
}


function processData(raw_dataset, wanted_publishers, images_publishers) {
    const root_node = new Node("Raiz", null)
    
    let games_nodes = []

    // Se crean los nodos de los juegos
    raw_dataset.map((game) => {
        game.genres.map((genre) => {
            const game_node = new Node(game.name, genre)

            game_node["AppID"] = game["AppID"]
            game_node["release_date"] = game["release_date"]
            game_node["price"] = game["price"]
            game_node["detailed_description"] = game["detailed_description"]
            game_node["about_the_game"] = game["about_the_game"]
            game_node["image"] = game["header_image"]
            game_node["website"] = game["website"]
            game_node["metacritic_score"] = game["metacritic_score"]
            game_node["metacritic_url"] = game["metacritic_url"]
            game_node["achievements"] = game["achievements"]
            game_node["recommendations"] = game["recommendations"]
            game_node["screenshots"] = game["screenshots"]
            game_node["movies"] = game["movies"]
            game_node["positive"] = game["positive"]
            game_node["negative"] = game["negative"]
            game_node["estimated_owners"] = game["estimated_owners"]
            game_node["developers"] = game["developers"]
            game_node["publishers"] = game["publishers"]
            game_node["genres"] = game["genres"]

            games_nodes.push(game_node)
        })
    })

    // Se crean los nodos de los publisers
    wanted_publishers.map((publisher, i) => {
        publisher_node = new Node(publisher, "Raiz")
        publisher_node["image"] = images_publishers[i]
        root_node.add_child(publisher_node)
    })

    // Se crean los nodos de los developers
    root_node.children.map((publisher) => {
        games_nodes.map((game) => {
            if (game.publishers.includes(publisher.name)) {
                game.developers.map((developer) => {
                    const developer_node = new Node(developer, publisher.name)

                    publisher.add_child(developer_node)
                })
            }
        })
    })

    // Se crean los nodos de los generos

    // root_node.children.map((publisher) => {
    //     publisher.children.map((developer) => {
    //         games_nodes.map((game) => {
    //             if (game.publishers.includes(publisher.name) && game.developers.includes(developer.name)) {
    //                 game.genres.map((genre) => {
    //                     const genre_node = new Node(genre, developer.name)

    //                     developer.add_child(genre_node)
    //                 })
    //             }
    //         })
    //     })
    // })

    // Se agregan los nodos de los juegos al arbol

    root_node.children.map((publisher) => {
        publisher.children.map((developer) => {
                games_nodes.map((game) => {
                    if (game.publishers.includes(publisher.name) && game.developers.includes(developer.name)) {
                        developer.add_child(game)
                    }
                })
        })
    })

    return root_node
}

function createTree(dataset) {
    d3.json(dataset).then(function(data) {
        const AppID = Object.keys(data)
    
        let raw_data = []
        AppID.map(function(id) {
            data[id]["publishers"].map(function(publisher) {
                if (most_known_publishers.includes(publisher)) {
                    data[id]["AppID"] = id
                    raw_data.push(data[id])
                }
            })
        })

        const processed_data = processData(raw_data, most_known_publishers, publisher_images)
        console.log(processed_data)
    })
}

createTree(dataset_file)
