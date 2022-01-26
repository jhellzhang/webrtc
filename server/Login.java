// https://blog.csdn.net/qq_37400312/article/details/81365335?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-3.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-3.pc_relevant_default&utm_relevant_index=6
// https://blog.csdn.net/qq_36617521/article/details/53556953?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2.pc_relevant_default&utm_relevant_index=5
// https://blog.csdn.net/kh971024/article/details/78072663?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-1.pc_relevant_default&spm=1001.2101.3001.4242.2&utm_relevant_index=4
import java.sql.* ;
import java.util.*;
// 创建数据库   
// mysql -u root -p
public class Login {
    private static String username;
    private static String password;
    private static Connection con ;
    private static String url = "jdbc:mysql://localhost:3306/user_info";
    private static String user = "root";
    private static String pass = "123456";
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
            case 2:
                login();
            default :
                System.out.println("num is wrong");
            
        }
        
    }
    public static void reg() throws SQLException{
        System.out.println("input username:");
        username = input.next();
        System.out.println("input password:");
        password = input.next();
        String sql = "insert into user_info (username,password) values(?,?)";
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
        String sql = "select ";
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