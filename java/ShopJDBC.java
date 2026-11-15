import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * MiniTienda - Actividad B (UF2405)
 * Conecta con MariaDB mediante JDBC, inserta un producto de prueba
 * y después elimina exactamente ese producto usando su identificador.
 */
public class ShopJDBC {

    // ===== Datos de conexión (credenciales de prácticas) =====
    private static final String URL     = "jdbc:mariadb://localhost:3306/tienda_practicas";
    private static final String USUARIO = "practicas";
    private static final String CLAVE   = "practicas123";

    public static void main(String[] args) {
        System.out.println("=== MiniTienda · Prueba JDBC ===");

        // try-with-resources: la conexión se cierra sola al terminar el bloque
        try (Connection con = DriverManager.getConnection(URL, USUARIO, CLAVE)) {

            System.out.println("Conexión establecida con " + con.getCatalog());

            listarProductos(con, "ESTADO ANTES DE INSERTAR");

            int id = insertarProducto(con, "Producto de prueba", new BigDecimal("9.99"), 5);

            listarProductos(con, "ESTADO DESPUÉS DE INSERTAR");

            borrarProducto(con, id);

            System.out.println("¿Existe todavía el producto con id " + id + "? "
                    + existeProducto(con, id));

            listarProductos(con, "ESTADO DESPUÉS DE BORRAR");

        } catch (SQLException e) {
            System.err.println("ERROR de base de datos:");
            System.err.println("  Mensaje:    " + e.getMessage());
            System.err.println("  SQLState:   " + e.getSQLState());
            System.err.println("  Código:     " + e.getErrorCode());
        }

        System.out.println("=== Fin del programa ===");
    }

    /**
     * Inserta un producto y devuelve el id que le ha asignado la base de datos.
     */
    private static int insertarProducto(Connection con, String nombre,
                                        BigDecimal precio, int stock) throws SQLException {

        String sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";

        try (PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, nombre);
            ps.setBigDecimal(2, precio);
            ps.setInt(3, stock);

            int filas = ps.executeUpdate();
            System.out.println("INSERT ejecutado. Filas afectadas: " + filas);

            if (filas != 1) {
                throw new SQLException("La inserción no ha añadido exactamente 1 fila.");
            }

            try (ResultSet claves = ps.getGeneratedKeys()) {
                if (claves.next()) {
                    int id = claves.getInt(1);
                    System.out.println("Producto insertado con id = " + id);
                    return id;
                }
                throw new SQLException("No se ha podido obtener el id generado.");
            }
        }
    }

    /**
     * Elimina únicamente el producto cuyo id se recibe.
     */
    private static void borrarProducto(Connection con, int id) throws SQLException {

        String sql = "DELETE FROM productos WHERE id = ?";

        try (PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, id);

            int filas = ps.executeUpdate();
            System.out.println("DELETE ejecutado. Filas afectadas: " + filas);

            if (filas == 1) {
                System.out.println("Producto con id = " + id + " eliminado correctamente.");
            } else {
                System.out.println("AVISO: no se ha encontrado ningún producto con id = " + id);
            }
        }
    }

    /**
     * Comprueba con un SELECT si sigue existiendo un producto con ese id.
     */
    private static boolean existeProducto(Connection con, int id) throws SQLException {

        String sql = "SELECT COUNT(*) FROM productos WHERE id = ?";

        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1) > 0;
            }
        }
    }

    /**
     * Muestra todos los productos de la tabla.
     */
    private static void listarProductos(Connection con, String titulo) throws SQLException {

        String sql = "SELECT id, nombre, precio, stock FROM productos ORDER BY id";

        System.out.println();
        System.out.println("--- " + titulo + " ---");

        try (PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            int total = 0;
            while (rs.next()) {
                System.out.printf("%3d | %-20s | %8s € | stock %d%n",
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getBigDecimal("precio"),
                        rs.getInt("stock"));
                total++;
            }
            System.out.println("(" + total + " productos)");
        }
        System.out.println();
    }
}