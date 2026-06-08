# IFBank — Internet Banking
 
Sistema de Internet Banking desenvolvido como projeto final da disciplina de Programação com Frameworks Web.
 
## Tecnologias
 
- **Back End:** Java 21 + Spring Boot
- **Front End:** Angular 21
- **Banco de dados:** MySQL
## Como Rodar
 
### Back End
 
```bash
cd backend
./mvnw spring-boot:run
```
 
API disponível em `http://localhost:8080`
 
### Front End
 
```bash
cd frontend
npm install
ng serve
```
 
Aplicação disponível em `http://localhost:4200`
 
> Certifique-se de que o banco de dados está configurado em `backend/src/main/resources/application.properties` antes de iniciar o back end.
 
