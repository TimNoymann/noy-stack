# Noy-Stack

## Spring Boot
Spring-Boot is more or less an enterprise standard for building Java-based backend applications.
There is nothing to add here.

### OpenAPI
We are using OpenAPI in a contract-first approach to define our RESTful APIs. 
Contract-first minimizes the boilerplate code and ensures that the API documentation is always in sync with the 
implementation. In my opinion, this is the easiest, most maintainable way to code APIs.

### Liquibase
Open Source tool for managing database schema changes. This ensures that our database schema is versioned and can be
easily migrated across different environments. This does not need any further explanation.


### Testcontainers
Main advantage is that it allows us to be as close to production as possible when writing integration tests.
We can spin up real instances of databases or other services in Docker containers for testing purposes.
Another advantage is that we prevent mocking e.g. kafka.

## Angular
My decision for angular is just based on personal preference. Many germany based enterprises use Angular for their 
frontend applications. It's component based architecture and strong typing with TypeScript makes it a solid choice for building
scalable web applications. Just overall a solid framework.


## PostgreSQL
My favourite relational database. It is free, open-source, feature-rich and extensible.
Its usage in AI speaks for itself. Just overall a great choice for any application that requires a relational database.
