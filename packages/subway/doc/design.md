# Design

[Draft]

```plantuml
@startuml


rectangle bastion_host {
    component server
    interface http<<4003>>
    interface ws<<3000>>
}

rectangle laptop {
    component client
    agent productService
}

cloud {
    actor request
}

request -[#hidden]r- http
http -r- server
server -d- ws

client --[#blue]u--> ws: 1) create socket tunnel
request -[#green]r-> http: 2) GET /products
ws -[#green]d--> client: 3) Event {GET, /products}
client -[#green]r-> productService: 4) proxy GET /products

@enduml
```