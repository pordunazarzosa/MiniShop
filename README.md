# MiniTienda
 
Proyecto de la actividad evaluable UF2405 (IFCD0112).
 
- **Actividad A:** tienda online de accesorios de informática con HTML, CSS y JavaScript: catálogo, formulario de pedido con validación, carrito y modo claro, oscuro o del sistema.
- **Actividad B:** programa Java que inserta y borra un producto en MariaDB mediante JDBC.
## Ver la web
 
https://TU-USUARIO.github.io/minitienda/
 
## Estructura
 
    minitienda/
    ├── index.html
    ├── css/styles.css
    ├── js/script.js
    └── java/
        ├── setup.sql
        └── ShopJDBC.java
 
## Ejecutar el programa Java
 
1. Ejecuta `java/setup.sql` en MariaDB (por ejemplo, en la pestaña SQL de phpMyAdmin).
2. Descarga MariaDB Connector/J y copia el `.jar` en `java/lib/`.
3. Desde la carpeta `java`:
        javac -encoding UTF-8 ShopJDBC.java
        java -cp ".;lib/*" ShopJDBC     # Windows
        java -cp ".:lib/*" ShopJDBC     # macOS / Linux
 
Las credenciales del código son de prácticas y solo sirven en local.