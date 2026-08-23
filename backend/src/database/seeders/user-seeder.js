import bcrypt from 'bcrypt';
import User from '../../modules/users/user-model.js';
import { USER_ROLES } from '../../core/utils/constants.js';

export async function up() {
  const users = [
    {
      full_name: 'Administrador NORTE',
      email: 'admin@norte.com',
      password: 'Admin123*',
      role: USER_ROLES.ADMIN,
      is_active: true,
    },
    {
      full_name: 'Cliente NORTE',
      email: 'cliente@norte.com',
      password: 'Cliente123*',
      role: USER_ROLES.CUSTOMER,
      is_active: true,
    },
  ];

  for (const userData of users) {
    const existingUser = await User.findOne({
      where: {
        email: userData.email,
      },
    });

    if (existingUser) {
      console.log(`⚠️ Usuario ya existe: ${userData.email}`);
      continue;
    }

    const password_hash = await bcrypt.hash(userData.password, 10);

    await User.create({
      full_name: userData.full_name,
      email: userData.email,
      password_hash,
      role: userData.role,
      is_active: userData.is_active,
    });

    console.log(`✅ Usuario creado: ${userData.email}`);
  }
}

export async function down() {
  await User.destroy({
    where: {
      email: ['admin@norte.com', 'cliente@norte.com'],
    },
  });

  console.log('🗑️ Usuarios del seeder eliminados');
}
