// https://blog.csdn.net/kh971024/article/details/78072663?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-1.pc_relevant_default&spm=1001.2101.3001.4242.2&utm_relevant_index=4
import java.sql.* ;
import java.util.*;


public class Login {
    private static String username;
    private static String password;
    private static Connection con ;
    private static String url = "jdbc:mysql://localhost:3306/login";
    private static String user = "root";
    private static String pass = "";
    static Scanner input = new Scanner(System.in);
    public static void main(String[] args) throws Exception{
        //加载数据库连接驱动，并连接
        Class.forName("com.mysql.cj.jdbc.Driver");
        con = DriverManager.getConnection(url,user,pass);

        System.out.println("input num:1 is reg,2 is login");
        int num = input.nextInt();
        switch (num){
            case 1:
                reg();
                break;
            case 2:
                login();
                break;
            default :
                System.out.println("num is wrong");
            
        }
        
    }
    public static void reg() throws SQLException{
        System.out.println("input username:");
        username = input.next();
        System.out.println("input password:");
        password = input.next();
        String sql = "insert into login (username,password) values(?,?)";
        PreparedStatement ptmt = con.prepareStatement(sql);
        ptmt.setString(1, username);
        ptmt.setString(2, password);
        ptmt.execute();
        System.out.println("reg sucess");
    }

    public static void login() throws SQLException{
        System.out.println("input username:");
        username = input.next();
        System.out.println("input password");
        password = input.next();
        String sql = "select * from login where username=? and password=?";
        PreparedStatement ptmt = con.prepareStatement(sql);
        ptmt.setString(1, username);
        ptmt.setString(2, password);
        ResultSet rs = ptmt.executeQuery();
        if (rs.next()){
            System.out.println("login sucess");
        }else{
            System.out.println("username or password is wrong");
        }


    }
}