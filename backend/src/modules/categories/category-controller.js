import categoryService from './category-service.js';
import { HTTP_STATUS } from '../../core/utils/constants.js';

class CategoryController {
  /**
   * GET /api/categories
   * Obtiene todas las categorías con paginación y filtros
   */
  async findAll(req, res, next) {
    try {
      const { page, limit, search, is_active } = req.query;

      const result = await categoryService.findAll(
        { page, limit, search, is_active },
        req.user,
      );

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.categories,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/categories/active
   * Obtiene todas las categorías activas
   */
  async findActive(req, res, next) {
    try {
      const categories = await categoryService.findActive();

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/categories/:id
   * Obtiene una categoría por su ID
   */
  async findById(req, res, next) {
    try {
      const { id } = req.params;

      const category = await categoryService.findById(id);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/categories/slug/:slug
   * Obtiene una categoría por su slug
   */
  async findBySlug(req, res, next) {
    try {
      const { slug } = req.params;

      const category = await categoryService.findBySlug(slug);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/categories
   * Crea una nueva categoría (solo admin)
   *
   * El slug se genera automáticamente en el Service.
   */
  async create(req, res, next) {
    try {
      const category = await categoryService.create(req.body, req.user);

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/categories/:id
   * Actualiza una categoría (solo admin)
   *
   * El slug no puede modificarse.
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;

      const category = await categoryService.update(id, req.body, req.user);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/categories/:id/status
   * Actualiza únicamente el estado de activación
   */
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;

      const category = await categoryService.updateStatus(
        id,
        is_active,
        req.user,
      );

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: `Categoría ${
          is_active ? 'activada' : 'desactivada'
        } exitosamente`,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/categories/:id
   * Elimina una categoría (solo admin)
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await categoryService.delete(id, req.user);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Categoría eliminada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
