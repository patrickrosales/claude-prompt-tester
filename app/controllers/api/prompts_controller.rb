module Api
  class PromptsController < ApplicationController
    skip_forgery_protection only: [:compare] # For CSRF token flexibility

    # POST /api/prompts/compare
    # Calls Claude API with provided parameters
    def compare
      prompt = params.require(:prompt)
      model = params[:model] || 'claude-sonnet-4-5-20250929'
      temperature = params[:temperature]&.to_f || 0.7
      max_tokens = params[:max_tokens]&.to_i || 1024

      if prompt.blank?
        return render json: { error: 'Prompt cannot be empty' }, status: :bad_request
      end

      if temperature.nil? || temperature < 0 || temperature > 1
        return render json: { error: 'Temperature must be between 0 and 1' }, status: :bad_request
      end

      if max_tokens < 1 || max_tokens > 4096
        return render json: { error: 'Max tokens must be between 1 and 4096' }, status: :bad_request
      end

      begin
        response = AnthropicApi.new.call_claude_api(prompt, model, temperature, max_tokens)
        render json: response
      rescue StandardError => e
        Rails.logger.error("Claude API Error: #{e.message}")
        render json: { error: e.message }, status: :internal_server_error
      end
    end

    # GET /api/models
    # Returns available Claude models
    def models
      available_models = [
        { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5 (Latest)' },
        { id: 'claude-opus-4-1-20250805', name: 'Claude Opus 4.1' },
        { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5' },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku (Legacy)' },
      ]
      render json: { models: available_models }
    end
  end
end
