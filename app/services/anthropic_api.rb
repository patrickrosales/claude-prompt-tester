require 'anthropic'

class AnthropicApi
    def initialize
        @client = Anthropic::Client.new(
            api_key: ENV["ANTHROPIC_API_KEY"]
        )
    end

    def call_claude_api(prompt, model, temperature, max_tokens)
        response = @client.messages.create(
            model: model,
            max_tokens: max_tokens,
            temperature: temperature,
            messages: [
                { role: 'user', content: prompt }
            ]
        )

        # Extract content from response
        # The response.content returns an array of content blocks
        content = response.content.first&.text || ''

        {
            content: content,
            model: model,
            temperature: temperature,
            max_tokens: max_tokens,
            timestamp: Time.current.iso8601
        }
        rescue StandardError => e
            Rails.logger.error("Anthropic API Error: #{e.class} - #{e.message}")
            Rails.logger.error("Model attempted: #{model}")
            Rails.logger.error("Full error: #{e.inspect}")
            raise "API Error: #{e.message}"
        end
end