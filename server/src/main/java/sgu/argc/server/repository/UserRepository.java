package sgu.argc.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sgu.argc.server.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}