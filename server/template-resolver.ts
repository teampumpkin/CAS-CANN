export class TemplateResolver {
  static resolve(template: string, context: Record<string, any>): string {
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
      const value = this.getNestedValue(context, path);
      return value !== undefined ? String(value) : match;
    });
  }

  static resolveObject(obj: any, context: Record<string, any>): any {
    if (typeof obj === 'string') {
      return this.resolve(obj, context);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.resolveObject(item, context));
    }
    
    if (obj && typeof obj === 'object') {
      const resolved: any = {};
      for (const [key, value] of Object.entries(obj)) {
        resolved[key] = this.resolveObject(value, context);
      }
      return resolved;
    }
    
    return obj;
  }

  static resolveWorkflowConfig(workflow: any, runtimeContext: Record<string, any> = {}): any {
    const context = {
      ...runtimeContext,
      NOW: new Date().toISOString(),
      TODAY: new Date().toISOString().split('T')[0],
      TIMESTAMP: Date.now(),
    };

    return {
      ...workflow,
      triggerConfig: this.resolveObject(workflow.triggerConfig, context),
      conditions: this.resolveObject(workflow.conditions, context),
      actions: this.resolveObject(workflow.actions, context),
    };
  }

  private static getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
}
