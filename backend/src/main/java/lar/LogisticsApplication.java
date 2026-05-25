package lar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import lar.entity.Admin;
import lar.repository.AdminRepository;

@SpringBootApplication
public class LogisticsApplication {

	public static void main(String[] args) {
		SpringApplication.run(LogisticsApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataSeeder(AdminRepository adminRepository) {
		return args -> {
			if (adminRepository.findByEmail("deepak@gmail.com") == null) {
				Admin admin = new Admin();
				admin.setName("Deepak Admin");
				admin.setEmail("deepak@gmail.com");
				admin.setPassword("123456");
				admin.setRole("ADMIN");
				adminRepository.save(admin);
				System.out.println("Seeded ADMIN user into admins table: deepak@gmail.com");
			}
		};
	}
}
