<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $this->actingAs($user = User::factory()->create(['role' => 'student']));

        $response = $this->get('/dashboard');
        $response->assertRedirect(route('student.dashboard'));
    }

    public function test_authenticated_admin_is_redirected_to_admin_dashboard()
    {
        $this->actingAs($user = User::factory()->create(['role' => 'admin']));

        $response = $this->get('/dashboard');
        $response->assertRedirect(route('admin.dashboard'));
    }

    public function test_authenticated_teacher_is_redirected_to_teacher_dashboard()
    {
        $this->actingAs($user = User::factory()->create(['role' => 'teacher']));

        $response = $this->get('/dashboard');
        $response->assertRedirect(route('teacher.dashboard'));
    }
}
